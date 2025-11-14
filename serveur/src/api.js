const express = require("express");
const Users = require("./entities/users.js");
const Messages = require("./entities/messages.js")
const { ObjectId } = require("mongodb");

function init(db) {
    const router = express.Router();
    router.use(express.json());

    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });

    const users = new Users.default(db);
    const messages = new Messages.default(db)

    /* Remplissage de la base de données */
    users.initUser();
    messages.initMessages()

    router.post("/user/login", async (req, res) => {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }

            if(! await users.exists(login)) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }

            let user = await users.checkpassword(login, password);

            if (user) {
                // Avec middleware express-session
                req.session.regenerate(function (err) {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: "Erreur interne"
                        });
                    }
                    else {
                        // C'est bon, nouvelle session créée
                        console.log("api.js user session : " + JSON.stringify(user))
                        req.session.user = user;
                        res.status(200).json({
                            status: 200,
                            message: "Login et mot de passe accepté",
                            user: user
                        });
                    }
                });
                return;
            }
            // Faux login : destruction de la session et erreur
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "login et/ou le mot de passe invalide(s)"
            });
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });

    router.put("/user", async (req, res) => {
        const { nom, prenom, pseudo, email, password } = req.body;

        if (!nom || !prenom || !pseudo || !email || !password) {
            res.status(400).json({
                status: 400,
                message: "Missing fields"
            });
            return;

        } else {
            const exist = await users.exists(pseudo, email)
            
            if (exist) { 
                console.log("api.js : il existe")
                res.status(409).json({
                    status: 409,
                    message: "Requete invalide : pseudo ou email deja utilisé"
                });

            } else {
                console.log("api.js : il en existe pas")
                users.createUser(nom, prenom, pseudo, email, password)
                .then((rep) => res.status(201).json({
                    status: 201,
                    message: "Insertion reussie"
                }))
                .catch((err) => res.status(500).send(err));
            }
            return;
        }
    });

    /*List des Users */
    router.get('/userList', async(req, res) => {
        await users.getAllUsers()
        .then((list) => res.status(200).json(list))
        .catch((e) => res.status(500).json(e))

        return;
    })

    router.post('/user/:id/messages', async (req, res) => {
        const {message, publicMsg} = req.body;
        let user = await users.getUserFromPseudo(req.params.id)

        if (user) {
            await messages.createMessage(req.params.id, publicMsg, message, false)
                .then((msgid) => {
                    res.status(200).json({
                        status: 200,
                        message: "Insertion reussie"
                    })
                })
                .catch((e) => {
                    res.status(500).json({
                        status: 500,
                        message: "Erreur interne : " + e
                    })
                }
            )
        } else {
            res.status(401).json({
                status: 401,
                message: "Utilisateur inconnu"
            })
        }
        
        return;
    })

    router.get('/messages', async(req, res) => {
        await messages.getListMessages()
            .then((list) => res.status(200).json(list))
            .catch((e) => res.status(500).json(e))

        return;
    })

    router.get('/message/:id/reponses', async (req, res) => {
        
        await messages.getListReponses(req.params.id)
            .then((list) => res.status(200).json(list))
            .catch((e) => res.status(500).json(e))
    
        return;
    })

    router.get('/user/:id/messages', async (req, res) => {
        await messages.getMessageFromPseudo(req.params.id)
            .then((list) => res.status(200).json(list))
            .catch((e) => res.status(500).json(e))

        return;
    })

    router.get('/user/:pseudo', async (req, res) => {
        await users.getUserFromPseudo(req.params.pseudo)
            .then ((user) => res.status(200).json(user))
            .catch(e => res.status(500).json(e))
    })

    router.get('/message/:id', async (req, res) => {
        await messages.getMessageFromId(req.params.id)
            .then (msg => res.status(200).json(msg))
            .catch (e => res.status(500).json(e))
    })

    router.get('/message/:id/likes', async (req, res) => {
        await messages.getMessageFromId(req.params.id)
            .then (msg => res.status(200).json(msg.likes))
            .catch (e => res.status(500).json(e))
    })

    router.get('/users/admins', async (req, res) => {
        const list = await users.getAllAdmins()
        res.status(200).json(list)
    })

    router.get('/users/membres', async (req, res) => {
        const list = await users.getAllMembres()
        res.status(200).json(list)
    })

    router.get('/users/requests', async (req, res) => {
        const list = await users.getAllReq()
        res.status(200).json(list)
    })

    router.post("/user/gestion/admins/:pseudo", async (req,res)=>{

        const { status } = req.body;

        await users.updateAdmin(status ,req.params.pseudo)
        .then((rep) => res.status(200).json({
            status : 200,
            message : "Modification reussite"
        }))
        .catch((err)=> res.status(500).send(err))

    });


    router.post("/user/gestion/membres/:pseudo", async (req,res)=>{

        const { status } = req.body;

        await users.updateMembre(status ,req.params.pseudo)
        .then((rep) => res.status(200).json({
            status : 200,
            message : "Modification reussite"
        }))
        .catch((err)=> res.status(500).send(err))

    });
    
    router.post('/user/:id/messages/reponses', async (req, res) => {
        const {pseudo, publicMsg, contenu, msgid} = req.body

        // ajout du commentaire
        await messages.addReponse(pseudo, publicMsg, contenu, msgid)
        .then (list => {
            res.status(200).json(list)
        })
        .catch (e => {
            res.status(500).json(e)
        })

    })

    router.post('/message/:id/likes', async (req, res) => {
        const { pseudo } = req.body
        
        await messages.addLike(req.params.id, pseudo)
        .then (likes => res.status(200).json(likes))
        .catch(e => res.status(500).json(e))
    })

    router.delete('/message/:id', async (req, res) => {
        const msgid = req.params.id

        if (!await messages.getMessageFromId(msgid)) { // le message n'existe pas
            res.status(401).json({
                status: 401,
                message: "Message inexistant"
            })

            return;
        }
        await messages.deleteListReponse(msgid)
        .then (async r => {
            await messages.deleteMessage(msgid)

            res.status(200).json({
                status: 200,
                message: "Suppression du message OK"
            })
        })
        .catch (e => res.status(500).json(e))
    })

    router.delete('/message/:msgid/reponse/:repid', async (req, res) => {
        const msgid = req.params.msgid
        const repid = req.params.repid

        if (!await messages.getMessageFromId(msgid)) { // le message n'existe pas
            res.status(401).json({
                status: 401,
                message: "Message inexistant"
            })

            return;
        }

        await messages.deleteRep(msgid, repid)
        .then (async r => {
            res.status(200).json({
                status: 200,
                message: "Suppression du message OK"
            })
        })
        .catch (e => res.status(500).json(e))
    })

    router.delete('/user/:pseudo', async (req, res) => {
        const pseudo = req.params.pseudo

        await users.deleteUserFromPseudo(pseudo)
        .then (res.status(200).json({
            status: 200,
            message: "Suppression du user OK"
        }))
        .catch (e => res.status(500).json(e))
    })

    return router;
}






exports.default = init;

