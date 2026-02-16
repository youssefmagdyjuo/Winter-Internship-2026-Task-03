import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import PopUpLayout from "../components/PopUpLayout";
import Button from "../components/Button";
import Input from "../components/Input";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../hooks/user";
import Selector from '../components/Selector';
import PaidToggle from "../components/PaidToggle";

export default function OrderDetails() {
    // role base 
    const [userRole, setUserRole] = useState('')
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role)
        }
        fetchRole()
    }, [])
    const navigate = useNavigate()
    const { id } = useParams();
    const [openToast, setOpenToast] = useState(false)
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('mvec_token')
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState({
        text: '',
        type: ''
    })
    const [isPaid, setIsPaid] = useState(false);
    const statusOptions = [
        'pending',
        'confirmed',
        'shipped',
        'delivered',
        'cancelled',
        'completed'
    ].map(status => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1)
    }));
    const [orderFormFields, setOrderFormFields] = useState([
        {
            name: 'orderStatus',
            value: '',
            placeholder: 'Order Status'
        }
    ]);

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;

        setOrderFormFields(prev =>
            prev.map(field =>
                field.name === fieldName
                    ? { ...field, value }
                    : field
            )
        );
    };


    useEffect(() => {
        const fetchOrder = async () => {            
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/v1/api/orders/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setOrder(response.data.data);
                setLoading(false);
                setIsPaid(response.data.data.isPaid)
            } catch (error) {
                console.log(error);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <Loader />;

    if (!order) return <p>Order not found</p>;

    // const handleOrderStatusChanged = async () => {
    //     const selectedStatus = orderFormFields.find(
    //         f => f.name === 'orderStatus'
    //     )?.value;
    //     try {
    //         const response = await axios.put(
    //             `${import.meta.env.VITE_API_URL}/v1/api/orders/${id}`,
    //             { status: selectedStatus },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             }
    //         );
    //         setMessage({ text: response.data.message, type: 'success' });
    //         setOpenToast(true);

    //         // ✅ Update UI immediately
    //         setOrder(prev => ({
    //             ...prev,
    //             status: selectedStatus,
    //             isPaid:isPaid
    //         }));
    //     } catch (error) {
    //         setMessage({
    //             text: error.response?.data?.message || "Something went wrong",
    //             type: 'error'
    //         });
    //         setOpenToast(true);
    //         setIsOpen(false);
    //     } finally {
    //         setTimeout(() => setOpenToast(false), 3000);
    //         setIsOpen(false);
    //     }
    // };
    const handleOrderStatusChanged = async () => {
        const selectedStatus = orderFormFields.find(
            f => f.name === 'orderStatus'
        )?.value;        
        if (!selectedStatus && isPaid === order.isPaid) {
            setMessage({ text: "No changes detected", type: "error" });
            setOpenToast(true);
            return;
        }


        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/v1/api/orders/${id}`,
                {
                    status: selectedStatus,
                    isPaid: isPaid   // 👈 admin only (backend handles permission)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage({ text: response.data.message, type: 'success' });
            setOpenToast(true);

            // ✅ خليه ياخد الداتا من السيرفر مش من الstate
            setOrder(response.data.data);

        } catch (error) {
            setMessage({
                text: error.response?.data?.message || "Something went wrong",
                type: 'error'
            });
            setOpenToast(true);
            setIsOpen(false);
        } finally {
            setTimeout(() => setOpenToast(false), 3000);
            setIsOpen(false);
        }
    };


    return (
        <div className="flex flex-col items-center p-6 minHeight">
            {
                openToast ? (<Toast
                    message={message.text}
                    type={message.type}
                />) : (<></>)
            }
            <h2 className="text-2xl font-bold mb-4">
                Order Details
            </h2>

            <table className="border border-gray-300 w-full max-w-2xl text-left">
                <tbody>
                    <tr className="border-b">
                        <th className="p-3">Order ID:</th>
                        <td className="p-3">{order._id}</td>
                    </tr>

                    <tr className="border-b">
                        <th className="p-3">Total Price:</th>
                        <td className="p-3">{order.totalAmount}$</td>
                    </tr>

                    <tr className="border-b">
                        <th className="p-3">Status:</th>
                        <td className="p-3">
                            {order.status}
                        </td>
                    </tr>

                    <tr className="border-b">
                        <th className="p-3">Payment:</th>
                        <td className="p-3">
                            {order.isPaid ? "Paid" : "Not Paid"}
                        </td>
                    </tr>

                    <tr>
                        <th className="p-3">Date:</th>
                        <td className="p-3">
                            {new Date(order.createdAt).toLocaleString()}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Products inside order */}
            <h3 className="text-xl font-semibold mt-6 mb-2">
                Products
            </h3>

            <table className="border border-gray-300 w-full max-w-2xl text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">Product</th>
                        <th className="p-2">Quantity</th>
                        <th className="p-2">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, index) => (
                        <tr key={index} className="border-t">
                            <td className="p-2">{item.productName}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">{item.price}$</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {
                userRole && userRole == 'customer'
                    ? (<>
                        <div className="orderBtn mt-4">
                            <Button
                                style="btn-danger"
                                disabled={order.status !== 'pending' && order.status !== 'confirmed'}
                                onClick={() => {
                                    handleInputChange(
                                        { target: { value: 'cancelled' } },
                                        'orderStatus'
                                    );
                                    setIsOpen(true);
                                }}

                            >
                                {order.status == 'completed' ? "Order Completed" : "Cancel Order"}
                            </Button>
                        </div>
                    </>)
                    : userRole && userRole == 'admin'
                        ? (<>
                            <div className="w-100 mt-4 flex gap-4">
                                <PaidToggle
                                    value={isPaid}
                                    onChange={setIsPaid}
                                />
                                <Selector
                                    options={statusOptions}
                                    placeholder="Status..."
                                    onChange={(selected) =>
                                        handleInputChange(
                                            { target: { value: selected.value } },
                                            'orderStatus'
                                        )
                                    }
                                />

                                <Button
                                    style="btn-primary"
                                    onClick={handleOrderStatusChanged}
                                >
                                    Update
                                </Button>
                            </div>
                        </>)
                        : (<></>)
            }
            <PopUpLayout open={isOpen}>
                <div className="flex flex-col justify-between gap-4">
                    <p className="text-xl text-center">
                        Are you sure you want to cancel this order?
                    </p>

                    <div className="flex gap-2 justify-center">
                        <Button
                            style="btn-danger"
                            onClick={() => { handleOrderStatusChanged() }}
                        >
                            Yes, Cancel
                        </Button>

                        <Button
                            onClick={() => setIsOpen(false)}
                            style="btn-secondary"
                        >
                            No
                        </Button>
                    </div>
                </div>
            </PopUpLayout>

        </div>
    );
}
