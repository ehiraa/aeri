use std::sync::Arc;
use crate::entities::Entity;
use crate::global::queries::get_query;
use crate::structs::shared::MediaNodes;
use actix_web::{web, HttpResponse};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use crate::global::metrics::Metrics;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Studio {
    pub id:                     i32,
    pub is_animation_studio:    bool,
    pub name:                   String,
    pub site_url:               String,
    pub favourites:             i32,
    pub media:                  MediaNodes,
}

#[derive(Deserialize)]
pub struct StudioRequest {
    pub studio_name:            String,
}

impl Entity<Studio, StudioRequest> for Studio {
    fn entity_name() -> String {
        "Studio".into()
    }

    async fn format(self, _request: &StudioRequest, _metrics: web::Data<Arc<Metrics>>) -> Result<Studio, HttpResponse> {
        Ok(self)
    }

    fn cache_key(request: &StudioRequest) -> String {
        format!("studio:{}", request.studio_name.to_lowercase())
    }

    fn query(request: &StudioRequest) -> Value {
        json!({ "query": get_query("studio"), "variables": { "search": request.studio_name }})
    }

    fn validate_request(request: &StudioRequest) -> Result<(), String> {
        if request.studio_name.is_empty() {
            return Err("No studio name was included".into());
        }

        Ok(())
    }
}
