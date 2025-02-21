use actix_web::{get,
                web,
                App,
                HttpResponse,
                HttpServer,
                Responder};

use colourful_logger::Logger as Logger;
use lazy_static::lazy_static;
use num_cpus;
use std::env;
use std::thread;

mod anilist;
mod cache;
mod global;
mod client;
mod structs;
mod entities;
mod format;

use anilist::media::{media_search, recommend};
use anilist::search::fetch_affinity;

use crate::anilist::oauth::anilist_oauth;
use crate::anilist::user::current_user;
use crate::entities::traits::Entity;
use crate::entities::{staff::Staff, studio::Studio, user::User, user_score::UserScore, relations::Relations, character::Character};
use cache::redis::Redis;
use client::proxy::Proxy;

lazy_static! {
    static ref logger: Logger = Logger::default();
    static ref redis:  Redis  = Redis::new();
    static ref proxy:  Proxy  = Proxy::new();
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Welcome to the Ani API!")
}

async fn manual() -> impl Responder {
    HttpResponse::Ok().body("Ani API")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().unwrap_or_default();

    logger.info_single("Starting The API", "Main");
    let ip = env::var("API_HOST").unwrap_or("0.0.0.0".to_string());
    let port = env::var("API_PORT").unwrap().parse::<u16>().unwrap_or(8080);
    let check_proxy = env::var("API_PROXY").map_err(|_| {
        logger.error_single("API_PROXY environment variable not set", "Main");
    });

    if check_proxy.is_ok() {
        tokio::spawn(async move {
            let mut attempts: u8 = 0;
            while attempts < 10 {
                if let Err(e) = proxy.update_proxy_list().await {
                    logger.error_single(&format!("Failed to update proxy list (attempt {}): {:?}", attempts + 1, e), "Main");
                    thread::sleep(std::time::Duration::from_secs(10));
                    attempts += 1;
                }
            }
            if attempts == 10 {
                logger.error_single("Failed to update proxy list after 10 attempts", "Main");
                std::process::exit(1);
            }
        });
    }

    logger.info_single(&format!("Listening on {}:{}", ip, port), "Main");
    HttpServer::new(move || {
        App::new()
            .service(hello)
            .service(media_search)
            .service(recommend)
            .service(fetch_affinity)
            .service(anilist_oauth)
            .service(current_user)
            .route("/hey", web::get().to(manual))
            .route("/studio", web::post().to(Studio::route))
            .route("/staff", web::post().to(Staff::route))
            .route("/user", web::post().to(User::route))
            .route("/user/scores", web::post().to(UserScore::route))
            .route("/relations", web::post().to(Relations::route))
            .route("/character", web::post().to(Character::route))
    })
    .workers(num_cpus::get())
    .bind((ip, port))?
    .run()
    .await
}
