use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Method, Request, Response, Server, StatusCode};
use serde_json::Value;
use std::convert::Infallible;
use std::net::SocketAddr;

async fn handle_request(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    if req.method() != Method::POST {
        return Ok(Response::builder()
            .status(StatusCode::METHOD_NOT_ALLOWED)
            .body(Body::from("Method not allowed"))
            .unwrap());
    }

    // Read the body
    match hyper::body::to_bytes(req.into_body()).await {
        Ok(bytes) => {
            match serde_json::from_slice::<Value>(&bytes) {
                Ok(json) => {
                    // Extract events array
                    if let Some(events) = json.get("events") {
                        return Ok(Response::builder()
                            .status(StatusCode::OK)
                            .header("Content-Type", "application/json")
                            .body(Body::from(events.to_string()))
                            .unwrap());
                    }
                    
                    Ok(Response::builder()
                        .status(StatusCode::BAD_REQUEST)
                        .body(Body::from("No events field found in JSON"))
                        .unwrap())
                }
                Err(_) => Ok(Response::builder()
                    .status(StatusCode::BAD_REQUEST)
                    .body(Body::from("Invalid JSON"))
                    .unwrap())
            }
        }
        Err(_) => Ok(Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .body(Body::from("Failed to read request body"))
            .unwrap())
    }
}

#[tokio::main]
async fn main() {
    let addr = SocketAddr::from(([127, 0, 0, 1], 8000));

    let make_svc = make_service_fn(|_conn| async {
        Ok::<_, Infallible>(service_fn(handle_request))
    });

    let server = Server::bind(&addr).serve(make_svc);

    println!("Server running on http://localhost:8000");

    if let Err(e) = server.await {
        eprintln!("server error: {}", e);
    }
}