<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;


use Tuupola\Middleware\HttpBasicAuthentication;
use \Firebase\JWT\JWT;

require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../bootstrap.php';

$app = AppFactory::create();

function  addHeaders (Response $response) : Response {
    $response = $response
    ->withHeader("Content-Type", "application/json")
    // ->withHeader('Access-Control-Allow-Origin', 'https://projet-berard-ludovic.onrender.com')
    ->withHeader('Access-Control-Allow-Headers', 'Content-Type,  Authorization')
    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    ->withHeader('Access-Control-Expose-Headers', 'Authorization');

    return $response;
}

function getJWTToken($request)
{
    $payload = str_replace("Bearer ", "", $request->getHeader('Authorization')[0]);
    $token = JWT::decode($payload,JWT_SECRET , array("HS256"));
    return $token; 
}

// $user, $email supprimé temporairement
function createJwt (Response $response) : Response {
    $issuedAt = time();
    $expirationTime = $issuedAt + 600; // jwt valide pour 600 secondes (10 minutes) à partir du moment de l'émission
    $payload = array(
        //'userid' => $userid,
        //'email' => $email,
        'iat' => $issuedAt,
        'exp' => $expirationTime
    );
    $token_jwt = JWT::encode($payload, JWT_SECRET, "HS256");
    $response = $response->withHeader("Authorization", "Bearer {$token_jwt}");
    return $response;
}

const JWT_SECRET = "TP-CNAM";

$app->get('/api/hello/{name}', function (Request $request, Response $response, $args) {
    $array = [];
    $array ["nom"] = $args ['name'];
    $response->getBody()->write(json_encode ($array));
    return $response;
});

$app->options('/api/catalogue', function (Request $request, Response $response, $args) {
    
    // Evite que le front demande une confirmation à chaque modification
    $response = $response->withHeader("Access-Control-Max-Age", 600);
    
    return addHeaders ($response);
});

// API Nécessitant un Jwt valide
$app->get('/api/catalogue/{filtre}', function (Request $request, Response $response, $args) {
    $filtre = $args['filtre'];
    $pathToJson = __DIR__ . '/../assets/mock/product-list.json';
    $json = file_get_contents($pathToJson);
    $data = json_decode($json, true); 

    if ($filtre) {
        $filtre = strtolower($filtre);
        $res = array_filter($data, function($obj) use ($filtre) { 
            return strpos(strtolower($obj["name"]), $filtre) !== false || 
                   strpos(strtolower($obj["category"]), $filtre) !== false;
        });
        $response->getBody()->write(json_encode(array_values($res)));
    } else {
        $response->getBody()->write(json_encode($data));
    }

    return addHeaders ($response);
});


// API Nécessitant un Jwt valide
$app->get('/api/catalogue', function (Request $request, Response $response, $args) {
    $pathToJson = __DIR__ . '/../assets/mock/product-list.json';
    $json = file_get_contents($pathToJson);
    $data = json_decode($json, true); 
    
    $response->getBody()->write(json_encode($data));
    
    return addHeaders($response);
});


$app->options('/api/utilisateur', function (Request $request, Response $response, $args) {
    
    // Evite que le front demande une confirmation à chaque modification
    $response = $response->withHeader("Access-Control-Max-Age", 600);
    
    return addHeaders ($response);
});

// API Nécessitant un Jwt valide // anciennement /api/user
$app->get('/api/utilisateur', function (Request $request, Response $response, $args) {
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
        $response = $response->withStatus(401);
    }

    return $response;
});

// APi d'authentification générant un JWT
$app->post('/api/login', function (Request $request, Response $response, $args) {   
    global $entityManager;
    $err=false;
    $body = $request->getParsedBody();
    $login = $body ['login'] ?? "";
    $pass = $body ['pass'] ?? "";

    if (!preg_match("/[a-zA-Z0-9]{1,20}/",$login))   {
        $err = true;
    }
    if (!preg_match("/[a-zA-Z0-9]{1,20}/",$pass))  {
        $err=true;
    }
    if (!$err) {
        $utilisateurRepository = $entityManager->getRepository('Utilisateur');
        $utilisateur = $utilisateurRepository->findOneBy(array('login' => $login, 'password' => $pass));
        if ($utilisateur and $login == $utilisateur->getLogin() and $pass == $utilisateur->getPassword()) {
            $response = addHeaders ($response);
            $response = createJwT ($response);
            $data = array('nom' => $utilisateur->getNom(), 'prenom' => $utilisateur->getPrenom());
            $response->getBody()->write(json_encode($data));
        } else {          
            $response = $response->withStatus(401);
        }
    } else {
        $response = $response->withStatus(401);
    }

    return $response;
});


// Middleware de validation du Jwt
$options = [
    "attribute" => "token",
    "header" => "Authorization",
    "regexp" => "/Bearer\s+(.*)$/i",
    "secure" => false,
    "algorithm" => ["HS256"],
    "secret" => JWT_SECRET,
    "path" => ["/api"],
    "ignore" => ["/api/hello","/api/utilisateur/login", "/api/register"],
    "error" => function ($response, $arguments) {
        $data = array('ERREUR' => 'Connexion', 'ERREUR' => 'JWT Non valide');
        $response = $response->withStatus(401);
        return $response->withHeader("Content-Type", "application/json")->getBody()->write(json_encode($data));
    }
];

// Chargement du Middleware
$app->add(new Tuupola\Middleware\JwtAuthentication($options));

// Run app
$app->run();
