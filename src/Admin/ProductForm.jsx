import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { baseUrl } from "../utils/constant";

const ProductForm = () => {
    const navigate = useNavigate();
    const { logoutAdmin, isAdminAuthenticated, adminToken } = useAuth();
    
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "", // single string
        size: [],     // changed to array for multiple selection
        images: [],
        is_featured: false, // Keep as boolean
    });

    const [imageUploadMethod, setImageUploadMethod] = useState("file"); // "file" or "url"
    const [imageFiles, setImageFiles] = useState([]); // Store actual file objects
    const [imagePreview, setImagePreview] = useState([]); // Store preview URLs

    // Handle admin logout
    const handleLogout = () => {
        logoutAdmin();
        toast.success("Admin logged out successfully");
        navigate("/admin-login");
    };

    // Check if admin is authenticated, redirect if not
    React.useEffect(() => {
        if (!isAdminAuthenticated || !adminToken) {
            toast.error("Admin session expired. Please login again.");
            navigate("/admin-login");
        }
    }, [isAdminAuthenticated, adminToken, navigate]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = [...imageFiles, ...files];
        const previewUrls = files.map((file) => URL.createObjectURL(file));

        setImageFiles(newFiles);
        setImagePreview([...imagePreview, ...previewUrls]);
    };

    const handleImageLinkAdd = (link) => {
        if (link) {
            setFormData({ ...formData, images: [...formData.images, link] });
        }
    };

    const removeImage = (index, type) => {
        if (type === "file") {
            const newFiles = imageFiles.filter((_, i) => i !== index);
            const newPreviews = imagePreview.filter((_, i) => i !== index);
            setImageFiles(newFiles);
            setImagePreview(newPreviews);
        } else {
            const newImages = formData.images.filter((_, i) => i !== index);
            setFormData({ ...formData, images: newImages });
        }
    };

    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Handle size checkbox changes
    const handleSizeChange = (size) => {
        const updatedSizes = formData.size.includes(size)
            ? formData.size.filter(s => s !== size)
            : [...formData.size, size];
        setFormData({ ...formData, size: updatedSizes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res;
            
            // Always send as FormData to handle file uploads
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('size', JSON.stringify(formData.size));
            formDataToSend.append('isFeatured', formData.is_featured); // Send as boolean
            
            // Handle main images
            if (imageUploadMethod === "file" && imageFiles.length > 0) {
                // Send file uploads
                imageFiles.forEach((file) => {
                    formDataToSend.append('images', file);
                });
            } else if (imageUploadMethod === "url" && formData.images.length > 0) {
                // Send URL images as JSON
                formDataToSend.append('imageUrls', JSON.stringify(formData.images));
            }
            
                 
            // Debug: Log what we're sending
            for (let [key, value] of formDataToSend.entries()) {
                if (value instanceof File) {
                    // console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
                } else {
                    // console.log(`${key}:`, value);
                }
            }
            
            res = await axios.post(`${baseUrl}/admin/add-product`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success("Product created successfully");
            // Reset form
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                size: [], // Reset to empty array
                images: [],
                is_featured: false, // Reset to boolean false
            });
            setImageFiles([]);
            setImagePreview([]);
            setImageUploadMethod("file");
        } catch (err) {
            console.error("Full error:", err);
            console.error("Error response:", err?.response?.data);
            
            // Handle session expiry
            if (err?.response?.status === 401) {
                toast.error("Admin session expired. Please login again.");
                logoutAdmin();
                navigate("/admin-login");
                return;
            }
            
            toast.error(err?.response?.data?.message || "Error creating product");
        }
    };

    // Don't render if not authenticated
    if (!isAdminAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Admin Header with Logout */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-sm text-gray-500">Product Management Dashboard</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">Admin Session</p>
                                <p className="text-xs text-green-600">● Active</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-md p-6 space-y-6"
                >
                    <h2 className="text-2xl font-bold mb-4 text-center">Create Product</h2>

                    {/* Name */}
                    <div>
                        <label className="block mb-1 font-medium">Product Name</label>
                        <input
                            type="text"
                            className="w-full border rounded-md p-2"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1 font-medium">Description</label>
                        <textarea
                            className="w-full border rounded-md p-2"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            required
                        ></textarea>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block mb-1 font-medium">Price (₹)</label>
                        <input
                            type="number"
                            className="w-full border rounded-md p-2"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>

                    {/* Category Single-select */}
                    <div>
                        <label className="block mb-1 font-medium">Category</label>
                        <select
                            className="w-full border rounded-md p-2"
                            value={formData.category}
                            onChange={(e) => handleSelectChange("category", e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {["Men", "Women", "Kids"].map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Size Multiple-select with checkboxes */}
                    <div>
                        <label className="block mb-1 font-medium">Size (Select Multiple)</label>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {["S", "M", "L", "XL", "XXL"].map((size) => (
                                <label key={size} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={size}
                                        checked={formData.size.includes(size)}
                                        onChange={() => handleSizeChange(size)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{size}</span>
                                </label>
                            ))}
                        </div>
                        {formData.size.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                                Selected: {formData.size.join(", ")}
                            </p>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block mb-1 font-medium">Main Images</label>

                        {/* Radio buttons for image upload method */}
                        <div className="flex gap-4 mb-3">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="imageMethod"
                                    value="file"
                                    checked={imageUploadMethod === "file"}
                                    onChange={(e) => {
                                        setImageUploadMethod(e.target.value);
                                        // Clear URL images when switching to file
                                        if (e.target.value === "file") {
                                            setFormData({ ...formData, images: [] });
                                        }
                                    }}
                                />
                                <span>Upload Files</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="imageMethod"
                                    value="url"
                                    checked={imageUploadMethod === "url"}
                                    onChange={(e) => {
                                        setImageUploadMethod(e.target.value);
                                        // Clear file images when switching to URL
                                        if (e.target.value === "url") {
                                            setImageFiles([]);
                                            setImagePreview([]);
                                        }
                                    }}
                                />
                                <span>Image URLs</span>
                            </label>
                        </div>

                        {/* Conditional input based on selected method */}
                        {imageUploadMethod === "file" ? (
                            <input
                                type="file"
                                multiple
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleImageChange}
                                className="mb-2"
                            />
                        ) : (
                            <input
                                type="text"
                                placeholder="Paste image URL and press Enter"
                                className="w-full border p-2 rounded-md mb-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleImageLinkAdd(e.target.value);
                                        e.target.value = "";
                                    }
                                }}
                            />
                        )}

                        {/* Display images */}
                        <div className="flex gap-2 flex-wrap mt-2">
                            {/* Display file previews */}
                            {imageUploadMethod === "file" && imagePreview.map((img, i) => (
                                <div key={`file-${i}`} className="relative">
                                    <img
                                        src={img}
                                        alt={`preview-${i}`}
                                        className="w-20 h-20 object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i, "file")}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {/* Display URL images */}
                            {imageUploadMethod === "url" && formData.images.map((img, i) => (
                                <div key={`url-${i}`} className="relative">
                                    <img
                                        src={img}
                                        alt={`url-${i}`}
                                        className="w-20 h-20 object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i, "url")}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>          

                    <div className="flex items-center space-x-2">
                        <label className="block mb-1 font-medium">Is Featured</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="is_featured"
                                    value={true}
                                    checked={formData.is_featured === true}
                                    onChange={(e) => {
                                        setFormData({ ...formData, is_featured: true });
                                    }}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="is_featured"
                                    value={false}
                                    checked={formData.is_featured === false}
                                    onChange={(e) => {
                                        setFormData({ ...formData, is_featured: false });
                                    }}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                        >
                            Submit Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
