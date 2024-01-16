<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

	function optionsCatalogue (Request $request, Response $response, $args) {
	    
	    // Evite que le front demande une confirmation à chaque modification
	    $response = $response->withHeader("Access-Control-Max-Age", 600);
	    
	    return addHeaders ($response);
	}

	function hello(Request $request, Response $response, $args) {
	    $array = [];
	    $array ["nom"] = $args ['name'];
	    $response->getBody()->write(json_encode ($array));
	    return $response;
	}
	
	function getSearchCatalogue(Request $request, Response $response, $args) {
		$filtre = $args['filtre'];
		$pathToJson = __DIR__ . '/../assets/mock/product-list.json';
		$json = file_get_contents($pathToJson);
		$data = json_decode($json, true); 
	
		if ($filtre) {
			$filtre = strtolower($filtre);
			$res = array_filter($data, function($obj) use ($filtre) { 
				return strpos(strtolower($obj["name"]), $filtre) !== false || strpos(strtolower($obj["category"]), $filtre) !== false;
			});
			$response->getBody()->write(json_encode(array_values($res)));
		} else {
			$response->getBody()->write(json_encode($data));
		}
	
		return addHeaders($response);
	}
	

	// API Nécessitant un Jwt valide
	// function getCatalogue (Request $request, Response $response, $args) {
	// 	$pathToJson = __DIR__ . '/../assets/mock/product-list.json';
	// 	$json = file_get_contents($pathToJson);
	// 	$data = json_decode($json, true); 
		
	// 	$response->getBody()->write(json_encode($data));
		
	// 	return addHeaders ($response);
	// }
	function getCatalogue (Request $request, Response $response, $args) {
		$data = file_get_contents(__DIR__ . '/../assets/mock/product-list.json');

	    $response->getBody()->write($data);
	    
	    return addHeaders ($response);
	}

	function optionsUtilisateur (Request $request, Response $response, $args) {
	    
	    // Evite que le front demande une confirmation à chaque modification
	    $response = $response->withHeader("Access-Control-Max-Age", 600);
	    
	    return addHeaders ($response);
	}

	// API Nécessitant un Jwt valide
	function getUtilisateur (Request $request, Response $response, $args) {
	    global $entityManager;
	    
	    $payload = getJWTToken($request);
	    $login  = $payload->userid;
	    
	    $utilisateurRepository = $entityManager->getRepository('Utilisateurs');
	    $utilisateur = $utilisateurRepository->findOneBy(array('login' => $login));
	    if ($utilisateur) {
		$data = array('nom' => $utilisateur->getNom(), 'prenom' => $utilisateur->getPrenom());
		$response = addHeaders ($response);
		$response = createJwT ($response);
		$response->getBody()->write(json_encode($data));
	    } else {
		$response = $response->withStatus(404);
	    }

	    return addHeaders ($response);
	}

	// APi d'authentification générant un JWT
	function postLogin (Request $request, Response $response, $args) {   
		global $entityManager;
		$err = false;
		$body = $request->getParsedBody();
		$login = $body['login'] ?? "";
		$pass = $body['password'] ?? "";
	
		if (!preg_match("/[a-zA-Z0-9]{1,20}/", $login)) {
			$err = true;
		}
		if (!preg_match("/[a-zA-Z0-9]{1,20}/", $pass)) {
			$err = true;
		}
		if (!$err) {
			$utilisateurRepository = $entityManager->getRepository('Utilisateurs');
			$utilisateur = $utilisateurRepository->findOneBy(array('login' => $login, 'password' => $pass));
			if ($utilisateur && $login == $utilisateur->getLogin() && $pass == $utilisateur->getPassword()) {
				$userid = $utilisateur->getId();
				$email = $utilisateur->getEmail();
	
				$response = createJwt($response, $userid, $email);
				$data = array('nom' => $utilisateur->getNom(), 'prenom' => $utilisateur->getPrenom());
				$response->getBody()->write(json_encode($data));
			} else {          
				$response = $response->withStatus(403);
			}
		} else {
			$response = $response->withStatus(500);
		}
	
		return addHeaders($response);
	}

	function postRegister(Request $request, Response $response, $args) {
		global $entityManager;
	
		$body = $request->getParsedBody();
		$login = $body['login'] ?? '';
		$password = $body['password'] ?? ''; // Il faudra HASHER LE MOT DE PASSE PLUS TARD
	
		// Validation de base
		if (!preg_match("/[a-zA-Z0-9]{1,20}/", $login) || !preg_match("/[a-zA-Z0-9]{1,20}/", $password)) {
			return addHeaders($response->withStatus(400)->write(json_encode(['message' => 'Données invalides'])));
		}
	
		// Vérification si l'utilisateur existe déjà
		$utilisateurRepository = $entityManager->getRepository('Utilisateurs');
		$existingUser = $utilisateurRepository->findOneBy(array('login' => $login));
		if ($existingUser) {
			return addHeaders($response->withStatus(409)->write(json_encode(['message' => 'Utilisateur déjà existant'])));
		}
	
		// Création d'un nouvel utilisateur
		$nouvelUtilisateur = new Utilisateur();
		$nouvelUtilisateur->setLogin($login);
		$nouvelUtilisateur->setPassword($password); // Vous devriez hasher le mot de passe ici
		$entityManager->persist($nouvelUtilisateur);
		$entityManager->flush();
	
		$response->getBody()->write(json_encode(['message' => 'Inscription réussie']));
		return addHeaders($response);
	}
	
