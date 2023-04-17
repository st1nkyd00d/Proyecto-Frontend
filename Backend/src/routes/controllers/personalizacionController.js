const jwt = require('jsonwebtoken');
const { resSuccess, resError } = require("../../../statusResponse/res");
const { usuario } = require("../../models/user");

module.exports = {
    async actualizarPreferencias(req, res) {
        try {
            const { estilosPref, sonidoPref } = req.body;
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(" ")[1]; // descomposición del bearer token
            console.log(token)
            const payload = jwt.verify(token, process.env.secret); // se decodifica el token
            const correo = payload.data.correo; // saco el correo del payload pa saber que usuario esta logeado
            console.log(correo) // lo pongo aqui opara saber que estoy imprimiendo el correo correcto xd

            // busco al usuario por el correo conseguido del payload
            const usuarioActualizado = await usuario.findOne({ where: { correo: correo } });
            console.log(usuarioActualizado)

            if (!usuarioActualizado) {
                return resError(req, res, 'El usuario no fue encontrado.', 404);
            }

            await usuarioActualizado.update(
                { estilosPref, sonidoPref },
                { where: { correo: correo } }
            );

            return resSuccess(req, res, 'Preferencias actualizadas exitosamente.', 200);
        } catch (error) {
            console.log(error);
            return resError(req, res, 'Ocurrió un error al actualizar las preferencias.', 500);
        }
    }
}