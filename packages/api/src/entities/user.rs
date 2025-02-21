use crate::anilist::queries::get_query;
use crate::entities::traits::Entity;
use crate::structs::shared::{Avatar, Favourites, Statistics};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use crate::format::user_addon::user_addon;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id:             Option<i32>,
    pub name:           Option<String>,
    pub site_url:       Option<String>,
    pub updated_at:     Option<i32>,
    pub banner_image:   Option<String>,
    pub about:          Option<String>,
    pub avatar:         Avatar,
    pub favourites:     Favourites,
    pub statistics:     Statistics,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FormattedUser {
    pub id:                 Option<i32>,
    pub name:               Option<String>,
    pub avatar:             Option<String>,
    pub banner_image:       Option<String>,
    pub about:              Option<String>,
    pub site_url:           Option<String>,
    pub updated_at:         Option<i32>,
    pub favourites:         Favourites,
    pub statistics:         Statistics,
    pub total_entries:      i32,
    pub top_genre:          String,
    pub top_format:         String,
    pub completion_rate:    i64,
}

#[derive(Deserialize)]
pub struct UserRequest {
    username: String,
}

impl Entity<FormattedUser, UserRequest> for User {
    fn entity_name() -> String {
        "User".into()
    }

    fn format(self, _request: &UserRequest) -> FormattedUser {
        let addon = user_addon(&self);

        FormattedUser {
            id:                 self.id,
            name:               self.name,
            avatar:             self.avatar.large,
            banner_image:       self.banner_image,
            about:              self.about,
            site_url:           self.site_url,
            updated_at:         self.updated_at,
            favourites:         self.favourites,
            statistics:         self.statistics,
            total_entries:      addon.total_entries,
            top_genre:          addon.top_genre,
            top_format:         addon.top_format,
            completion_rate:    addon.completion_rate,
        }
    }

    fn cache_key(request: &UserRequest) -> String {
        format!("user:{}", request.username)
    }

    fn query(request: &UserRequest) -> Value {
        json!({ "query": get_query("user"), "variables": { "name": request.username }})
    }

    fn validate_request(request: &UserRequest) -> Result<(), String> {
        if request.username.len() == 0 {
            return Err("No username name was included".into());
        }

        Ok(())
    }
}