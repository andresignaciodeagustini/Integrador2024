const User = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const saltRounds = 10; 
const secret = process.env.SECRET || 'your-secret-key'; // Asegúrate de que el secreto esté definido

async function getUserById(req, res) {
    try {
        const id = req.params.id;
        console.log(`Buscando usuario con ID: ${id}`);
        const user = await User.findById(id).select({ password: 0 });

        if (!user) {
            console.warn(`Usuario con ID ${id} no encontrado.`);
            return res.status(404).send({
                ok: false,
                message: "No se pudo encontrar el usuario"
            });
        }

        console.log(`Usuario encontrado: ${JSON.stringify(user)}`);
        res.status(200).send({
            ok: true,
            message: "Usuario encontrado",
            user
        });

    } catch (error) {
        console.error(`Error en getUserById: ${error.message}`, error);
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener el usuario"
        });
    }
}

async function getUsers(req, res) {
    try {
        const limit = parseInt(req.query.limit, 10) || 3; // Número de usuarios por página
        const page = parseInt(req.query.page, 10) || 0;   // Número de página, empezando desde 0

        const filters = {};
        if (req.query.name) {
            filters.fullName = { $regex: req.query.name, $options: 'i' };
        }

        console.log(`Buscando usuarios con filtros: ${JSON.stringify(filters)}, página: ${page}, límite: ${limit}`);

        const [users, total] = await Promise.all([
            User.find(filters)
                .select({ password: 0 })
                .collation({ locale: 'es' })
                .skip(page * limit)
                .limit(limit)
                .sort({ fullName: 1 }), // Corrige el campo de ordenación a 'fullName'
            User.countDocuments(filters)
        ]);

        console.log(`Usuarios obtenidos: ${JSON.stringify(users)}, total: ${total}`);
        
        res.status(200).send({
            ok: true,
            message: "Usuarios obtenidos correctamente",
            users,
            total
        });

    } catch (error) {
        console.error(`Error en getUsers: ${error.message}`, error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener usuarios"
        });
    }
}

async function postUser(req, res) {
    try {
        if (req.user?.role !== "ADMIN_ROLE") {
            req.body.role = "CLIENT_ROLE";
        }

        console.log(`Creando usuario con datos: ${JSON.stringify(req.body)}`);
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User(req.body);
        const newUser = await user.save();
        newUser.password = undefined;

        console.log(`Usuario creado: ${JSON.stringify(newUser)}`);
        res.status(201).send({
            ok: true,
            message: "Usuario creado correctamente",
            user: newUser
        });

    } catch (error) {
        console.error(`Error en postUser: ${error.message}`, error);
        res.status(500).send({
            ok: false,
            message: "Error al crear el usuario"
        });
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        console.log(`Eliminando usuario con ID: ${id}`);
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            console.warn(`Usuario con ID ${id} no encontrado para eliminar.`);
            return res.status(404).send({
                ok: false,
                message: "No se encontró el usuario que deseaba borrar"
            });
        }

        console.log(`Usuario eliminado: ${JSON.stringify(deletedUser)}`);
        res.status(200).send({
            ok: true,
            message: "El usuario fue borrado correctamente"
        });

    } catch (error) {
        console.error(`Error en deleteUser: ${error.message}`, error);
        res.status(500).send({
            ok: false,
            message: "Error al borrar el usuario"
        });
    }
}

async function updateUser(req, res) {
    try {
        const id = req.params.idUpdate;
        console.log(`Actualizando usuario con ID: ${id}`);

        if (req.user.role !== 'ADMIN_ROLE' && req.user._id.toString() !== id) {
            console.warn(`Permiso denegado para editar el usuario con ID: ${id}`);
            return res.status(400).send({
                ok: false,
                message: "No se puede editar este usuario"
            });
        }

        const newData = req.body;

        if (newData.password) {
            console.log('Actualizando contraseña del usuario');
            newData.password = await bcrypt.hash(newData.password, saltRounds);
        }

        if (req.user.role !== 'ADMIN_ROLE') {
            newData.role = undefined;
        }

        const updUser = await User.findByIdAndUpdate(id, newData, { new: true });

        if (!updUser) {
            console.warn(`Usuario con ID ${id} no encontrado para actualizar.`);
            return res.status(404).send({
                ok: false,
                message: "No se encontró el usuario"
            });
        }

        console.log(`Usuario actualizado: ${JSON.stringify(updUser)}`);
        res.status(200).send({
            ok: true,
            message: "Usuario actualizado correctamente",
            user: updUser
        });

    } catch (error) {
        console.error(`Error en updateUser: ${error.message}`, error);
        res.status(500).send({
            ok: false,
            message: "No se pudo editar el usuario"
        });
    }
}

async function login(req, res) {
    try {
        const email = req.body.email?.toLowerCase();
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).send({
                ok: false,
                message: "Email y password son requeridos"
            });
        }

        console.log('Email a buscar:', email);

        const user = await User.findOne({ email: email });
        console.log('Usuario encontrado:', user);

        if (!user) {
            return res.status(404).send({
                ok: false,
                message: "Datos incorrectos"
            });
        }

        console.log('Hash de la contraseña almacenado:', user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Contraseña coincide:', isMatch);

        if (!isMatch) {
            return res.status(401).send({
                ok: false,
                message: "Datos incorrectos"
            });
        }

        user.password = undefined;

        const token = jwt.sign({ user: user.toObject() }, secret, { expiresIn: '1h' });

        res.status(200).send({
            ok: true,
            message: "Login exitoso",
            user,
            token
        });

    } catch (error) {
        console.log("Error en login:", error);
        res.status(500).send({
            ok: false,
            message: "Error al hacer el login"
        });
    }
}


module.exports = {
    getUsers,
    postUser,
    deleteUser,
    updateUser,
    getUserById,
    login
};
