const User = require('../models/user.model');
const PreviousOrder = require('../models/previousorder.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const saltRounds = 10; 
const secret = process.env.SECRET;

async function getUserById(req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select({ password: 0 });

        if (!user) {
            return res.status(404).send({
                ok: false,
                message: "No se pudo encontrar el usuario"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Usuario encontrado",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener usuario"
        });
    }
}

async function getUsers(req, res) {
    try {
        const limit = parseInt(req.query.limit, 10) || 3; // Número de usuarios por página
        const page = parseInt(req.query.page, 10) || 0;   // Número de página, empezando desde 0

        const filters = {};
        if (req.query.name) {
            filters.fullname = { $regex: req.query.name, $options: 'i' };
        }

        const [users, total] = await Promise.all([
            User.find(filters)
                .select({ password: 0 })
                .collation({ locale: 'es' })
                .skip(page * limit)
                .limit(limit)
                .sort({ fullname: 1 }),
            User.countDocuments(filters)
        ]);

        res.status(200).send({
            ok: true,
            message: "Usuarios obtenidos correctamente",
            users,
            total
        });

    } catch (error) {
        console.log("Error en getUsers:", error);
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

        req.body.password = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User(req.body);
        const newUser = await user.save();

        // Inicializa una lista vacía de PreviousOrder para el nuevo usuario
        const initialOrder = new PreviousOrder({ user: newUser._id, products: [] });
        await initialOrder.save();

        // Asocia la nueva entrada de PreviousOrder con el usuario
        newUser.previousOrders = [initialOrder._id];
        await newUser.save();

        newUser.password = undefined;

        res.status(201).send(newUser);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al crear el usuario"
        });
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send({
                ok: false,
                message: "No se encontró el usuario que deseaba borrar"
            });
        }

        // Eliminar la PreviousOrder asociada al usuario
        await PreviousOrder.deleteMany({ user: id });

        res.status(200).send({
            ok: true,
            message: "El usuario fue borrado correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al borrar el usuario"
        });
    }
}

async function updateUser(req, res) {
    try {
        const id = req.params.idUpdate;

        if (req.user.role !== 'ADMIN_ROLE' && req.user._id !== req.params.id){
            return res.status(400).send({
                ok: false,
                message: "No se puede editar este usuario"
            });
        }

        const newData = req.body;

        // Hashear password en el update
        if (newData.password) {
            newData.password = await bcrypt.hash(newData.password, saltRounds);
        }

        // Resetear Role
        if (req.user.role !== 'ADMIN_ROLE') {
            newData.role = undefined;
        }

        const updUser = await User.findByIdAndUpdate(id, newData, { new: true });

        if (!updUser) {
            return res.status(404).send({
                ok: false,
                message: "No se encontró el usuario"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Usuario actualizado correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "No se pudo editar usuario"
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

        const user = await User.findOne({ email: { $regex: email, $options: "i" } });

        if (!user) {
            return res.status(404).send({
                ok: false,
                message: "Datos incorrectos"
            });
        }

        // Verificación de la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                ok: false,
                message: "Datos incorrectos"
            });
        }

        user.password = undefined; // Remover la contraseña del usuario para no enviarla en el token

        const token = jwt.sign({ user }, secret, { expiresIn: '1h' });

        res.status(200).send({
            ok: true,
            message: "Login exitoso",
            user,
            token
        });

    } catch (error) {
        console.log(error);
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
