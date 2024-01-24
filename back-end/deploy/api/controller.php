<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

function optionsCatalogue(Request $request, Response $response, $args)
{

	// Evite que le front demande une confirmation à chaque modification
	$response = $response->withHeader("Access-Control-Max-Age", 600);

	return addHeaders($response);
}

function hello(Request $request, Response $response, $args)
{
	$array = [];
	$array["nom"] = $args['name'];
	$response->getBody()->write(json_encode($array));
	return $response;
}

function getSearchCatalogue(Request $request, Response $response, $args)
{
	$filtre = $args['filtre'];
	$pathToJson = __DIR__ . '/../assets/mock/product-list.json';
	$json = file_get_contents($pathToJson);
	$data = json_decode($json, true);

	if ($filtre) {
		$filtre = strtolower($filtre);
		$res = array_filter($data, function ($obj) use ($filtre) {
			return strpos(strtolower($obj["name"]), $filtre) !== false || strpos(strtolower($obj["category"]), $filtre) !== false;
		});
		$response->getBody()->write(json_encode(array_values($res)));
	} else {
		$response->getBody()->write(json_encode($data));
	}

	return addHeaders($response);
}

function getCatalogue(Request $request, Response $response, $args)
{
	$data = file_get_contents(__DIR__ . '/../assets/mock/product-list.json');

	$response->getBody()->write($data);

	return addHeaders($response);
}

function optionsUtilisateur(Request $request, Response $response, $args)
{

	// Evite que le front demande une confirmation à chaque modification
	$response = $response->withHeader("Access-Control-Max-Age", 600);

	return addHeaders($response);
}

// API Nécessitant un Jwt valide
function getUtilisateur(Request $request, Response $response, $args)
{
	global $entityManager;

	$payload = getJWTToken($request);
	$login  = $payload->userid;

	$utilisateurRepository = $entityManager->getRepository('Utilisateurs');
	$utilisateur = $utilisateurRepository->findOneBy(array('login' => $login));
	if ($utilisateur) {
		$data = array('nom' => $utilisateur->getNom(), 'prenom' => $utilisateur->getPrenom());
		$response = addHeaders($response);
		$response = createJwT($response);
		$response->getBody()->write(json_encode($data));
	} else {
		$response = $response->withStatus(404);
	}

	return addHeaders($response);
}

// APi d'authentification générant un JWT
function postLogin(Request $request, Response $response, $args)
{
	global $entityManager;
	$body = $request->getParsedBody();
	$login = $body['login'] ?? "";
	$pass = $body['password'] ?? "";

	if (empty($login) || empty($pass)) {
		return addHeaders($response->withStatus(400)->write(json_encode(['message' => 'Login et mot de passe requis'])));
	}

	$utilisateurRepository = $entityManager->getRepository('Utilisateurs');
	$utilisateur = $utilisateurRepository->findOneBy(['login' => $login]);

	if (!$utilisateur) {
		return addHeaders($response->withStatus(403)->write(json_encode(['message' => 'Utilisateur non trouvé'])));
	}

	if (!password_verify($pass, $utilisateur->getPassword())) {
		return addHeaders($response->withStatus(403)->write(json_encode(['message' => 'Mot de passe incorrect'])));
	}

	$userid = $utilisateur->getId();
	$email = $utilisateur->getEmail();

	$response = createJwt($response); //$response = createJwt($response, $userid, $email);
	$data = ['nom' => $utilisateur->getNom(), 'prenom' => $utilisateur->getPrenom()];
	$response->getBody()->write(json_encode($data));

	return addHeaders($response);
}

function postRegister(Request $request, Response $response, $args)
{
	global $entityManager;

	$body = json_decode($request->getBody(), true);
	$nom = isset($body['nom']) ? htmlspecialchars($body['nom']) : '';
	$prenom = isset($body['prenom']) ? htmlspecialchars($body['prenom']) : '';
	$login = isset($body['login']) ? htmlspecialchars($body['login']) : '';
	$email = $body['email'] ?? '';
	$password = $body['password'] ?? '';

	// Validation des données
	if (
		!preg_match("/[a-zA-Z0-9]{1,20}/", $login) ||
		!preg_match("/[a-zA-Z0-9]{1,20}/", $password) ||
		empty($nom) ||
		empty($prenom) ||
		!filter_var($email, FILTER_VALIDATE_EMAIL)
	) {
		$responseBody = json_encode(['message' => 'Données invalides']);
		$response->getBody()->write($responseBody);
		return addHeaders($response->withStatus(400));
	}

	// Vérifier si l'utilisateur existe déjà
	$conn = $entityManager->getConnection();
	$sql = "SELECT * FROM Utilisateurs WHERE login = ?";
	$stmt = $conn->executeQuery($sql, [$login]);
	$existingUser = $stmt->fetchOne();

	if ($existingUser) {
		// Utilisateur existe déjà
		$responseBody = json_encode(['message' => 'Utilisateur déjà existant']);
		$response->getBody()->write($responseBody);
		return addHeaders($response->withStatus(409));
	} else {
		// Créer un nouvel utilisateur
		$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
		$conn->insert('Utilisateurs', [
			'nom' => $nom,
			'prenom' => $prenom,
			'login' => $login,
			'password' => $hashedPassword
		]);

		// Réponse succès
		$responseBody = json_encode(['message' => 'Inscription réussie']);
		$response->getBody()->write($responseBody);
		return addHeaders($response);
	}
}


function postLogout(Request $request, Response $response, $args)
{
	$data = array('message' => 'Déconnexion réussie');
	$response->getBody()->write(json_encode($data));

	return addHeaders($response)->withStatus(200);
}
