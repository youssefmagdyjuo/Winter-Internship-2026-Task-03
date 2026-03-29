import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import PopUpLayout from "../components/PopUpLayout";
import Button from "../components/Button";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../hooks/user";
import Selector from '../components/Selector';

export default function BookingDetails() {

    const [userRole, setUserRole] = useState('');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openToast, setOpenToast] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [status, setStatus] = useState('');

    const token = localStorage.getItem('ssbms_token');
    const { id } = useParams();
    const navigate = useNavigate();

    // Get user role
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role);
        };
        fetchRole();
    }, []);

    // Fetch booking
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/v1/api/bookings/${id}`, // 👈 غيرها لـ bookings لو غيرت الراوت
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setBooking(res.data.data);
                setStatus(res.data.data.status);
                console.log(res.data.data.status);

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    if (loading) return <Loader />;
    if (!booking) return <p>Booking not found</p>;

    // Update status
    const handleUpdate = async () => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/v1/api/bookings/${id}`, // 👈 غيرها لو عندك endpoint مختلف
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBooking(res.data.data);

            setMessage({ text: res.data.message, type: 'success' });
            setOpenToast(true);

        } catch (err) {
            setMessage({
                text: err.response?.data?.message || "Error",
                type: 'error'
            });
            setOpenToast(true);
        } finally {
            setTimeout(() => setOpenToast(false), 3000);
            setIsOpen(false);
        }
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <div className="flex flex-col items-center p-6 minHeight">

            {openToast && (
                <Toast message={message.text} type={message.type} />
            )}

            <h2 className="text-2xl font-bold mb-4">
                Booking Details
            </h2>

            {/* Booking Info */}
            <table className="border w-full max-w-2xl text-left">
                <tbody>

                    <tr className="border-b">
                        <th className="p-3">Booking ID:</th>
                        <td className="p-3">{booking._id}</td>
                    </tr>

                    <tr className="border-b">
                        <th className="p-3">Service:</th>
                        <td className="p-3">
                            {booking.serviceId.title || "N/A"}
                        </td>
                    </tr>

                    <tr className="border-b">
                        <th className="p-3">Provider:</th>
                        <td className="p-3">
                            {booking.providerId.name || "N/A"}
                        </td>
                    </tr>

                    <tr className="border-b">
                        <th className="p-3">Date:</th>
                        <td className="p-3">
                            {new Date(booking.date).toLocaleString()}
                        </td>
                    </tr>

                    <tr>
                        <th className="p-3">Status:</th>
                        <td className="p-3">
                            {booking.status}
                        </td>
                    </tr>

                </tbody>
            </table>

            {/* CUSTOMER ACTION */}
            {
                userRole === 'customer' && (
                    <div className="mt-4">
                        <Button
                            style="btn-danger"
                            disabled={booking.status !== 'pending'}
                            onClick={() => {
                                setStatus('cancelled');
                                setIsOpen(true);
                            }}
                        >
                            Cancel Booking
                        </Button>
                    </div>
                )
            }

            {/* PROVIDER / ADMIN ACTION */}
            {
                (userRole === 'provider' || userRole === 'admin') && (
                    <div className="mt-4 flex gap-4 w-70">

                        <Selector
                            options={statusOptions}
                            placeholder=" status"
                            onChange={(selected) => setStatus(selected.value)}
                        />

                        <Button
                            style="btn-primary"
                            onClick={handleUpdate}
                        >
                            Update
                        </Button>
                    </div>
                )
            }

            {/* CONFIRM CANCEL */}
            <PopUpLayout open={isOpen}>
                <div className="flex flex-col gap-4 text-center">
                    <p className="text-lg">
                        Are you sure you want to cancel this booking?
                    </p>

                    <div className="flex gap-2 justify-center">
                        <Button style="btn-danger" onClick={handleUpdate}>
                            Yes
                        </Button>

                        <Button
                            style="btn-secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            No
                        </Button>
                    </div>
                </div>
            </PopUpLayout>

        </div>
    );
}