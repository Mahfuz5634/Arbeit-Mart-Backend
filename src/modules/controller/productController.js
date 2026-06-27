import Product from "../../models/Product.js";

const getProduct=async(req,res)=>{
   try{
    const products = await Product.find({isActive:true});
    res.json(products);

   }catch(error){
    res.status(500).json({message:'Error for fetching product'})
   }
}


const getProductById=async(req,res)=>{
    try {const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }
        else{
             res.status(404).json({message:"Product not found"})
        }
    } catch (error) {
       res.status(500).json({message:"server error"})
    }
};

const createProduct = async(req,res)=>{
    try {
        const{name,description,category,basePrice,attributes,variants}=req.body;

        const product= new Product({
            name,description,category,basePrice,attributes,variants
        })
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'an error to created product'});
    }
}


const updateProduct = async (req, res) => {
  try {
    const { name, description, category, basePrice, attributes, variants, isActive } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
    
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.basePrice = basePrice || product.basePrice;
      product.attributes = attributes || product.attributes;
      product.variants = variants || product.variants;
      
      if (isActive !== undefined) {
        product.isActive = isActive;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
  
    const product = await Product.findByIdAndDelete(req.params.id);

    if (product) {
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
const productController={
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
    
}
export default productController;