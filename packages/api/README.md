# Aeri API
An API built in Rust to be fast and easy to use.

> [!WARNING]
> ### INTENDED USE
> This API is mainly to be used with [Aeri](https://github.com/tomosfps/aeri), a discord bot that I made<br/>
> To automatically grab scores and display information. If you feel the need<br/>
> That certain things should be implemented, refer to [Contributing to API](#contributing-to-the-api)

## Features
- [x] Cache scores for media, media itself and user information
- [x] Dynamic caching for media (caching data until next episode aires e.g.)
- [x] Multiple endpoints with ease of use
- [x] Extremely fast and built in logging
- [x] Requires little to none setup

## Using Aeri API

1.  Use the `.env.example` to create an `.env` file (Ensure the `.env` is within the root of the project)
2.  Once setup the `.env` file, ensure you have both Docker and Docker Compose installed for your system
3.  Run `docker compose build && docker compose up`
4.  View the endpoints and their methods to use the API

## Example usage
0.0.0.0 is being used here, but it will depend on your `.env`.

```python
# Python example using requests library
import requests

url = "http://0.0.0.0:8080/media"
data = {
    "media_id": 170083,
    "media_type": "ANIME"
}

response = requests.post(url, json=data)
print(response.json())
```

```javascript
// JavaScript example using fetch API
const url = "http://0.0.0.0:8080/media";
const data = {
    media_id: 170083,
    media_type: "ANIME"
};

fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));
```

```bash
# cURL example
curl -X POST http://0.0.0.0:8080/media \
-H "Content-Type: application/json" \
-d '{"media_id": 170083, "media_type": "ANIME"}'
```

## Contributing to the API
If you feel like Aeri API is missing certain features, or would like to see more stuff implemented<br/>
Feel free to open a pull requests or issue.

1. Fork the repository
2. Create a new branch: `git checkout -b '<branch_name>'`
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin '<aeri>/<location>'`
5. Create the pull request

## License
This project uses the following license: [MIT LICENSE](https://github.com/tomosfps/aeri/blob/main/LICENSE.md).
