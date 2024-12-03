/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { db } from "./Firebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore"

const Products = () => {

    
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({name: "", price: ""});
    const [editProduct, setEditProduct] = useState(null)
    const [editDetails, setEditDetails] = useState({name: "", price: ""});

    const productsCollection = collection(db, "products");

    const fetchProducts = async () => {
        const data = await getDocs(productsCollection);
        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id})));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    
    const addProduct = async () => {
        try {
            if (!newProduct.name || !newProduct.price) return;
            await addDoc(productsCollection, newProduct);
            setNewProduct({ name: "", price: ""});
            fetchProducts();
        } catch (error) {
            console.error("Error adding product: ", error.message);
          }
        
    };

    const updateProduct = async (id) => {
        const productDoc = doc(db, "products", id)
        await updateDoc(productDoc, editDetails);
        setEditProduct(null)
        fetchProducts();
    };

    const deleteProduct = async (id) => {
        const productDoc = doc(db, "products", id);
        await deleteDoc(productDoc);
        fetchProducts();
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Market Place Product Management</h1>
            <div className="mb-4">
                <input 
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value})
                    }
                    className="border p-2 mr-2"
                />
                <input 
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value})
                    }
                    className="border p-2 mr-2"
                />
                <button onClick={addProduct} className=" bg-green-400 text-white p-2">
                    Add Product
                </button>
            </div>
            <ul>
                {products.map((product) =>(
                    <li key={product.id} className="flex items-center mb-2">
                       {editProduct === product.id ? (
                        <div>
                            <input 
                                type="text" 
                                value={editDetails.name}
                                onChange={(e) =>
                                    setEditDetails({ ...editDetails, name: e.target.value})
                                }
                                className="border p-2 mr-2"
                            />
                            <input 
                                type="number" 
                                value={editDetails.price}
                                onChange={(e) =>
                                    setEditDetails({ ...editDetails, price: e.target.value})
                                }
                                className="border p-2 mr-2"
                            />
                            <button 
                                onClick={() => updateProduct(product.id)}
                                className="bg-green-500 text-white p-2 mr-2"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditProduct(null)}
                                className="bg-gray-500 text-white p-2"
                            >
                                Cancel
                            </button>
                        </div>
                       ) : (
                        <>
                            <span className="mr-4">
                                {product.name} - ${product.price}
                            </span>
                            <button
                                onClick={() => {
                                    setEditProduct(product.id);
                                    setEditDetails({
                                        name: product.name,
                                        price: product.price,
                                    });
                                }} 
                                className="bg-yellow-500 text-white p-2 mr-2"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => deleteProduct(product.id)}
                                className="bg-red-500 text-white p-2"
                            >
                                Delete
                            </button>
                            <img src="data:image/jpeg;base64,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"></img>
                        </>
                        
                       )} 
                    </li>
                ))}
            </ul>
        </div>
    );

};


export default Products;