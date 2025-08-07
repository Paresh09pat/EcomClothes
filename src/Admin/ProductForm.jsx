import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { baseUrl } from "../utils/constant";

const ProductForm = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const isEditMode = Boolean(productId);
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
    const [loading, setLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(isEditMode);

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

    // Load existing product data when in edit mode
    const loadProductData = async () => {
        if (!isEditMode || !productId) return;
        
        try {
            setLoadingProduct(true);
            const response = await axios.get(`${baseUrl}/admin/get-all-products`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });

            if (response.data.success) {
                // Find the specific product from the products array
                const product = response.data.products.find(p => p._id === productId);
                
                if (!product) {
                    toast.error("Product not found");
                    navigate("/admin/product-management");
                    return;
                }
                
                // Parse sizes if it's a JSON string
                let parsedSizes = [];
                try {
                    parsedSizes = typeof product.size === 'string' ? JSON.parse(product.size) : product.size || [];
                } catch {
                    parsedSizes = [];
                }

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price?.toString() || "",
                    category: product.category || "",
                    size: parsedSizes,
                    images: product.imageUrls || [],
                    is_featured: product.isFeatured || false,
                });

                // Set image previews but let user choose upload method
                if (product.imageUrls && product.imageUrls.length > 0) {
                    setImagePreview(product.imageUrls);
                    // Don't automatically set to "url" - let user choose
                }
            } else {
                toast.error("Failed to load product data");
                navigate("/admin/product-management");
            }
        } catch (error) {
            console.error("Error loading product:", error);
            toast.error("Failed to load product data");
            navigate("/admin/product-management");
        } finally {
            setLoadingProduct(false);
        }
    };

    useEffect(() => {
        if (isEditMode) {
            loadProductData();
        }
    }, [isEditMode, productId, adminToken]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = [...imageFiles, ...files];
        const previewUrls = files.map((file) => URL.createObjectURL(file));

        setImageFiles(newFiles);
        setImagePreview([...imagePreview, ...previewUrls]);
    };

    // Validate image URL
    const isValidImageUrl = (url) => {
        try {
            new URL(url);
            // Check if it's an image URL (basic check)
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
            const hasImageExtension = imageExtensions.some(ext => 
                url.toLowerCase().includes(ext)
            );
            
            // Allow Cloudinary URLs even without file extensions
            const isCloudinary = url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
            
            return hasImageExtension || isCloudinary || url.includes('unsplash.com') || url.includes('cdn.') || url.includes('images.');
        } catch {
            return false;
        }
    };

    const handleImageLinkAdd = (link) => {
        if (link && link.trim()) {
            const trimmedLink = link.trim();
            
            // Validate URL
            if (!isValidImageUrl(trimmedLink)) {
                toast.error('Please enter a valid image URL');
                return;
            }
            
            // Check if URL already exists
            if (formData.images.includes(trimmedLink)) {
                toast.warn('This image URL is already added');
                return;
            }
            
            const newImages = [...formData.images, trimmedLink];
            setFormData({ ...formData, images: newImages });
            
            // Update preview for URL method
            if (imageUploadMethod === "url") {
                setImagePreview(newImages);
            }
            
            console.log('Added image URL:', trimmedLink);
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
            
            // Update preview for URL method
            if (imageUploadMethod === "url") {
                setImagePreview(newImages);
            }
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
        setLoading(true);

        try {
            let res;
            let dataToSend;
            let headers = {
                Authorization: `Bearer ${adminToken}`,
            };

            // Determine what type of image data to send based on current method and available data
            const hasNewFileUploads = imageUploadMethod === "file" && imageFiles.length > 0;
            const hasImageUrls = imageUploadMethod === "url" && formData.images.length > 0;

            if (hasNewFileUploads) {
                // User is uploading new files - use FormData
                dataToSend = new FormData();
                dataToSend.append('name', formData.name);
                dataToSend.append('description', formData.description);
                dataToSend.append('price', formData.price);
                dataToSend.append('category', formData.category);
                dataToSend.append('size', JSON.stringify(formData.size));
                dataToSend.append('isFeatured', formData.is_featured);
                
                // In edit mode, explicitly indicate we're replacing images
                if (isEditMode) {
                    dataToSend.append('replaceImages', 'true');
                }

                // Add the new files
                imageFiles.forEach((file) => {
                    dataToSend.append('images', file);
                });

                headers['Content-Type'] = 'multipart/form-data';
                console.log('Sending NEW FILE UPLOADS - Replace existing images');
                
            } else {
                // Use JSON - either for URLs or no images
                dataToSend = {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    size: formData.size,
                    isFeatured: formData.is_featured
                };

                // Handle image updates explicitly
                if (hasImageUrls) {
                    dataToSend.imageUrls = formData.images;
                    if (isEditMode) {
                        dataToSend.replaceImages = true;
                    }
                    console.log('Sending IMAGE URLS - Replace existing images:', formData.images);
                } else if (isEditMode && imageUploadMethod === "file" && imageFiles.length === 0) {
                    // User selected file method but didn't upload files - keep existing
                    dataToSend.keepExistingImages = true;
                    console.log('EDIT MODE: Keeping existing images (no changes)');
                } else if (isEditMode) {
                    // User wants to clear images
                    dataToSend.clearImages = true;
                    console.log('EDIT MODE: Clearing all images');
                } else {
                    console.log('CREATE MODE: No images provided');
                }

                headers['Content-Type'] = 'application/json';
            }

            console.log('Sending data:', dataToSend);
            console.log('Headers:', headers);

            if (isEditMode) {
                // Update existing product
                res = await axios.put(`${baseUrl}/admin/update-product/${productId}`, dataToSend, {
                    headers
                });
                toast.success("Product updated successfully");
                navigate("/admin/product-management");
            } else {
                // Create new product
                res = await axios.post(`${baseUrl}/admin/add-product`, dataToSend, {
                    headers
                });
                toast.success("Product created successfully");
                
                // Reset form for new product creation
                setFormData({
                    name: "",
                    description: "",
                    price: "",
                    category: "",
                    size: [],
                    images: [],
                    is_featured: false,
                });
                setImageFiles([]);
                setImagePreview([]);
                setImageUploadMethod("file");
            }
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

            toast.error(err?.response?.data?.message || `Error ${isEditMode ? 'updating' : 'creating'} product`);
        } finally {
            setLoading(false);
        }
    };

    // Don't render if not authenticated
    if (!isAdminAuthenticated) {
        return null;
    }

    // Show loading when loading product data in edit mode
    if (loadingProduct) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading product data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Product Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-md p-6 space-y-6"
                >
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        {isEditMode ? 'Edit Product' : 'Create Product'}
                    </h2>

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
                        
                        {isEditMode && (
                            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm text-blue-800">
                                    <strong>Edit Mode:</strong> Choose how you want to handle images:
                                    <br />• Select "Upload Files" to replace with new files
                                    <br />• Select "Image URLs" to keep or update existing URLs
                                </p>
                            </div>
                        )}

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
                                            // In edit mode, clear URL preview but keep file preview if any
                                            if (isEditMode) {
                                                setImagePreview(imageFiles.map(file => URL.createObjectURL(file)));
                                            }
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
                                            // In edit mode, restore URL preview from formData
                                            if (isEditMode && formData.images.length > 0) {
                                                setImagePreview(formData.images);
                                            } else {
                                                setImagePreview([]);
                                            }
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
                            <div className="space-y-2">
                                <input
                                    type="url"
                                    placeholder="Paste image URL (Cloudinary, CDN, etc.) and press Enter"
                                    className="w-full border p-2 rounded-md"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleImageLinkAdd(e.target.value);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                                <p className="text-xs text-gray-500">
                                    Supported: Cloudinary, image CDNs, direct image URLs (.jpg, .png, etc.)
                                </p>
                            </div>
                        )}

                        {/* Image count display */}
                        {(imagePreview.length > 0 || formData.images.length > 0) && (
                            <div className="text-sm text-gray-600 mb-2">
                                Images: {imageUploadMethod === "file" ? imagePreview.length : formData.images.length}
                                {isEditMode && (
                                    <span className="ml-2 text-blue-600">
                                        (Will {imageUploadMethod === "file" && imageFiles.length > 0 ? "replace" : imageUploadMethod === "url" && formData.images.length > 0 ? "update" : "keep existing"})
                                    </span>
                                )}
                            </div>
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
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                        onLoad={(e) => {
                                            e.target.style.display = 'block';
                                            e.target.nextSibling.style.display = 'none';
                                        }}
                                    />
                                    <div 
                                        className="w-20 h-20 bg-gray-200 rounded-md border text-xs text-gray-500 text-center"
                                        style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        Image<br/>Load Error
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i, "url")}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                        title="Remove image"
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
                            disabled={loading || loadingProduct}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading 
                                ? (isEditMode ? 'Updating...' : 'Creating...') 
                                : (isEditMode ? 'Update Product' : 'Submit Product')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
