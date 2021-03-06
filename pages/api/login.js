import cookie, {serialize} from "cookie"
import axios from "axios";

const API_URL = "http://localhost/api/v1"

export default async (req, res) => {
    const cookies =  cookie.parse(req.headers.cookie ?? '');
    const domain_name = cookies.domain ?? false;
    console.log({domain_name})
    if ( domain_name === false){
        return res.status(401).json({
            error: 'The Domain does not exist or something wrong with the domain!'
        })
    }
    if ( req.method === 'POST') {
        const {username, password} = req.body;
        let data = {
            username,
            password,
            domain_name
        }
        const apiRes = await axios.post(`${API_URL}/login/get-token`, data);
        if (apiRes.status === 200) {
            res.setHeader('Set-Cookie', [
                    serialize(
                        'access', apiRes.data.access_token,
                        {
                            httpOnly: true,
                            secure: false, // HTTPS request is not a concern right now
                            maxAge: 60 * 120, // 2 hours
                            sameSite: 'strict',
                            path: '/'
                        }
                    )
                ])

            res.status(200).json(
                {success: "Successful Login!"}
            );
        }
        else {
            return res.status(apiRes.status).json({
                error: 'Authentication failed'
            });
        }
    }
    else{
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({error: `Method ${req.method} not allowed`});
    }

};