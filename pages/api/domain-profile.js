import cookie from "cookie"
import axios from "axios"

const API_URL = "http://localhost/api/v1";

export default async (req, res) => {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
        return res.status(401).json({
            error: 'User is not authorized!'
        })
    }
    //GET
    if(req.method === "GET"){
        const domain_name=req.query.domain_name
        try{
            const apiRes = await axios({
                method: 'GET',
                url: `${API_URL}/domain/domain-profile`,
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                params: {
                    domain_name: domain_name
                }
            });
            const data = apiRes.data;

            if (apiRes.status === 200){
                return res.status(200).json({
                    name: data.name,
                    id: data.id,
                    datasets:2,
                    deployed: data.deployed_on,
                    owner: "TO BE FETCHED",
                    description: data.description,
                    email: data.support_email,
                    tags: ["dummy tag 1", "dummy tag 2"]
                });
            }
            else{
                return res.status(apiRes.status).json({
                    error: data.error
                });
            }
        }
        catch (error){
            console.log(error)
            return res.status(500).json({
                error: "Oops! Server Error!"
            });
        }
    } else if(req.method == "PUT") {
        try {
            const body = {
                "description": req.body.description,
                "email": req.body.email,
                "tags": req.body.tags
            }

            const apiRes = await axios.put(`${API_URL}/domain/CHANGE_HERE`,
                body,
                {
                    method: 'PUT',
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${access}`
                    }
                });
            const data = apiRes.data;

            if (apiRes.status === 200) {
                return res.status(200).json({
                    description: data.description,
                    email: data.email,
                    tags: data.tags
                });
            } else {
                return res.status(apiRes.status).json({
                    error: data.error
                });
            }
        } catch (error) {
            return res.status(500).json({
                error: "Oops! Server Error!"
            });
        }
    } else if(req.method == "DELETE") {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'User is not authorized!'
            })
        }

        try {
            const apiRes = await axios.delete(`${API_URL}/domain/CHANGE_HERE`,
                {
                    method: 'DELETE',
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${access}`
                    },
                });
            const data = apiRes.data;

            if (apiRes.status === 200) {
                return res.status(200)
            } else {
                return res.status(apiRes.status).json({
                    error: data.error
                });
            }
        } catch (error) {
            return res.status(500).json({
                error: "Oops! Server Error!"
            });
        }
    } else {
        //res.setHeader('Allow', ['GET']);
        return res.status(405).json({error: `Method ${req.method} not allowed`});
    }

};