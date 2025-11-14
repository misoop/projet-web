const bcrypt = require('bcrypt');

class Users {

    constructor (client) {
        this.client = client
        this.db = this.client.db("mongodb");
        this.collection = this.db.collection("users")
    }

    async initUser(){//Méthode pour initialiser des users dans la base de données

        try {
            const nb_users = await this.collection.countDocuments();
    
            if (nb_users == 0) {

                
                let user1 = await this.createUser("Merill", "Mai", "mai_ml", "mai@email.com", "maiforum");
                let user2 = await this.createUser("Bouali","Camelia","cam","camelia@email.com","camelia1234")
                let user3 = await this.createUser("Song","Michelle","michelle","michelle@email.com","michelle1111")

                /*Création de deux demandes d'inscription */
                let new1 = await this.createUser('Ash','Téa','téas',"téa@email.com","téasorbonne")
                let new2 = await this.createUser('Mary','Rose','rosa','rose@email.com','rose3962')
                /**/

                while(!user1 || !user2 || !user3) {
                   user1= await this.getUserFromPseudo("mai_ml")
                   user2= await this.getUserFromPseudo("cam")
                   user3 = await this.getUserFromPseudo("michelle") 
                }
                /*Création de trois membres */
                await this.updateMembre(false, "mai_ml");
                await this.updateMembre(false,"cam");
                await this.updateMembre(false,"michelle")
                /**/

                /*Création d'un admin */
                await this.updateAdmin(false, "mai_ml");
                /**/



            }
    
        } catch (err) {
            console.error("Erreur lors de l'initialisation des utilisateurs : ", err);
        }
    }


    async createUser (nom, prenom, pseudo, email, password) { 
        try {

            const plainTextPassword = password;

            bcrypt.hash(plainTextPassword, 10, async (err, hash) => {
                if (err) {
                    console.error('Erreur lors du hachage du mot de passe :', err);
                    return;
                }

                // date d'inscription
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1; // Les mois dans JavaScript sont indexés à partir de zéro, donc nous ajoutons 1
                const day = date.getDate();
                const formattedDate = `${day}-${month}-${year}`;

                const user = {
                    pseudo: pseudo,
                    email: email,
                    password: hash, 
                    nom: nom,
                    prenom: prenom,
                    membre: false,
                    admin: false,
                    date: formattedDate
                }

                await this.collection.insertOne(user)
                
                return user
            });
            
        } catch (e) {
            console.log("Erreur : " + e)
        }
    }

    async getAllUsers () {
        try{
            const userList = await this.collection.find().toArray();

            return userList;

        }catch(e){
            console.log("Erreur dans geAllUsers", e);
        }

    }

    async getAllMembres () {
        try {
            const membres = await this.collection.find({ membre: true }).toArray();

            return membres

        } catch (e) {
            console.log("Erreur dans getAllMembres", e);
        }
    }

    async getAllAdmins () {
        try {
            const admins = await this.collection.find({ admin: true }).toArray();

            return admins

        } catch (e) {
            console.log("Erreur dans getAllAdmins", e);
        }
    }

    async getAllReq () {
        try {
            const req = await this.collection.find({ membre: false }).toArray();

            return req

        } catch (e) {
            console.log("Erreur dans getAllReq", e);
        }
    }

    async getUserFromPseudo (pseudo) {
        try {
            const user = await this.collection.findOne({ pseudo: pseudo });

            if (user) {
                return user

            } else {
                return null
            }

        } catch (e) {
            console.log("Erreur : " + e)
        }
    }

    async updateAdmin(status, pseudo){ //Pour rendre ou retirer le status d'admin à un user
        try {

            const user = await this.getUserFromPseudo(pseudo);
            
            if (user) { //si le user est présent dans la base de données

                await this.collection.updateOne(
                    {pseudo : pseudo},
                    {$set : {admin : !status}}
                )
                
                return;

            }

        } catch(e) {
            console.log("Erreur dans isAdmin : ",e)
        }
    }


    async updateMembre(status, pseudo){ //Pour rendre ou retirer le status d'admin à un user
        try {

            const user = await this.getUserFromPseudo(pseudo);
            
            if (user) { //si le user est présent dans la base de données

                await this.collection.updateOne(
                    {pseudo : pseudo},
                    {$set : {membre : !status}}
                )
                
                return;

            }

        } catch(e) {
            console.log("Erreur : ",e)
        }
    }

    async deleteUserFromPseudo (pseudo) {
        try {
            await this.collection.deleteOne({pseudo: pseudo})
            
            return;

        } catch (e) {
            console.log("Erreur : " + e)

        }
    }
  
    async exists (login, email) {
        try {
            const same_email = await this.collection.findOne({ email: email });
            const same_pseudo = await this.collection.findOne({ pseudo: login });
            
            return same_email || same_pseudo

        } catch (e) {
            console.log("Erreur : " + e)

        }
    }
  
    async checkpassword (login, password) {
        try {
            const user = await this.collection.findOne({pseudo: login});

            if (user) {
                const validPwd = await bcrypt.compare(password, user.password);

                if (validPwd) {
                    return user
                }
            }
            
            return null

        } catch (e) {
            console.log("Erreur : " + e)
        }

    }
  
}
  
exports.default = Users;
  
  