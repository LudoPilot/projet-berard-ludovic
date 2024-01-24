<?php
	use Psr\Http\Message\ResponseInterface as Response;
	use Psr\Http\Message\ServerRequestInterface as Request;
	use Tuupola\Middleware\HttpBasicAuthentication;
	use \Firebase\JWT\JWT;
	
	const JWT_SECRET = "TP-CNAM";

	function getJWTToken($request)
	{
	    $payload = str_replace("Bearer ", "", $request->getHeader('Authorization')[0]);
	    $token = JWT::decode($payload,JWT_SECRET , array("HS256"));
	    return $token; 
	}
	// $userid, $email supprimé temporairement des paramètres
	function createJwt (Response $response) : Response {
		$issuedAt = time();
		$expirationTime = $issuedAt + 800; // jwt valide pendant 60 secondes à partir du moment de l'émission
		$email = 'email@pardefaut.com';
		$payload = array(
			//'userid' => $userid,
			'email' => $email,
			'iat' => $issuedAt,
			'exp' => $expirationTime
		);
		$token_jwt = JWT::encode($payload, JWT_SECRET, "HS256");
		$response = $response->withHeader("Authorization", "Bearer {$token_jwt}");
		return $response;
	}
	
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

	function addHeaders(Response $response): Response {
		return $response
			->withHeader("Content-Type", "application/json")
			->withHeader('Access-Control-Expose-Headers', 'Authorization');
			//->withHeader('Access-Control-Allow-Origin', '*') // Autoriser toutes les origines ou spécifier votre URL frontend
			// ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
			// ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
			// ->withHeader('Access-Control-Expose-Headers', 'Authorization');
	}

	// Chargement du Middleware
	$app->add(new Tuupola\Middleware\JwtAuthentication($options));

