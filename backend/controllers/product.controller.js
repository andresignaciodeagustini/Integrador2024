const Product = require('../models/product.models');


async function getProducts(req, res) {
    

    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 3; // Cambia el límite a 4 productos por página
       
        const filter = [];

        if (req.query.name) filter.push ({name : { $regex: req.query.name, $options: 'i'}}) 
        if (req.query.category) filter.push ({category : req.query.category}) 
        if (req.query.minPrice) filter.push ({category : req.query.minPrice}) 
        if (req.query.maxPrice) filter.push ({category : req.query.maxPrice}) 

        if(filter.length === 0 ) filter.push({})

        console.log(filter)
       
       
        const products = await Product.find()
            .populate("category", "name")
            .skip(page * limit)
            .limit(limit);

        const total = await Product.countDocuments({
            $and: filter
        });

        res.status(200).send({
            ok: true,
            message: "Productos obtenidos correctamente",
            products,
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener productos"
        });
    }
}

// Crear un nuevo producto
async function postProduct(req, res) {
    try {
        const product = new Product(req.body);

        if (req.file?.filename) {
            product.image = req.file.filename;
        }

        const newProduct = await product.save();
        res.status(201).send({
            ok: true,
            message: "Producto creado correctamente",
            product: newProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al crear producto"
        });
    }
}

// Obtener producto por ID
async function getProductById(req, res) {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate("category", "name");
        
        if (!product) {
            return res.status(404).send({
                ok: false,
                message: "Producto no encontrado"
            });
        }
        
        res.status(200).send({
            ok: true,
            message: "Producto encontrado correctamente",
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener el producto"
        });
    }
}

// Eliminar producto por ID
async function deleteProduct(req, res) {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        
        if (!deletedProduct) {
            return res.status(404).send({
                ok: false,
                message: "Producto no encontrado para eliminar"
            });
        }
        
        res.status(200).send({
            ok: true,
            message: "Producto eliminado correctamente",
            product: deletedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al eliminar el producto"
        });
    }
}

// Actualizar producto por ID
async function updateProduct(req, res) {
    try {
        const id = req.params.id;
        const data = req.body; 

        if(req.file?.filename){
            data.image = req.file.filename 
        }else{
            delete data.image;
        }

        data.updatedAt = Date.now();
        

        const product = await Product.findByIdAndUpdate(id, data, { new: true });
        
        if (!product) {
            return res.status(404).send({
                ok: false,
                message: "Producto no encontrado para actualizar"
            });
        }
        
        res.status(200).send({
            ok: true,
            message: "Producto actualizado correctamente",
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al actualizar el producto"
        });
    }
}

module.exports = {
    getProducts,
    postProduct,
    getProductById,
    deleteProduct,
    updateProduct
};
