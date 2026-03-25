import { Link } from "react-router-dom";
import Button from "../components/Button";
import VantaBackGround from "../components/BG/VantaBackGround";
import CloudsBackground from "../components/BG/CloudsBackground";

export default function Home() {
    return (
        <div>

            {/* Hero Section */}
            <section className="heroSection center">
                {/* <VantaBackGround /> */}
                <CloudsBackground />
                <div className="heroContent">
                    <h1>Kliordx</h1>
                    <p>
                        Discover and book professional services easily.
                        Connect with trusted providers and get things done fast.
                    </p>

                    <div style={{ width: "15rem" }}>
                        <Link to="/services">
                            <Button style={'btn-primary'}>
                                <div className="flex gap-2 items-center justify-center">
                                    <i className="fa-solid fa-calendar-check"></i>
                                    <span>Browse Services</span>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Popular Services */}
            <section className="py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Popular Services
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {[
                        { title: "AC Repair", desc: "Fast & reliable HVAC service" },
                        { title: "Home Cleaning", desc: "Deep cleaning for your space" },
                        { title: "Plumbing", desc: "Fix leaks & installations" },
                        { title: "IT Support", desc: "Technical help anytime" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>


            {/* How It Works */}
            <section className="py-16 px-6 bg-gray-50">
                <h2 className="text-3xl font-bold text-center mb-12">
                    How It Works
                </h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">1. Search</h3>
                        <p className="text-gray-500">
                            Find the service you need from multiple categories.
                        </p>
                    </div>

                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">2. Choose Provider</h3>
                        <p className="text-gray-500">
                            Compare ratings, reviews, and availability.
                        </p>
                    </div>

                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">3. Book & Relax</h3>
                        <p className="text-gray-500">
                            Confirm your booking and let the professional handle the rest.
                        </p>
                    </div>
                </div>
            </section>


            {/* Top Providers */}
            <section className="py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Top Rated Providers
                </h2>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {[
                        { name: "Ahmed Ali", rating: "4.9", service: "Plumber" },
                        { name: "Sara Hassan", rating: "4.8", service: "Cleaner" },
                        { name: "Mohamed Samy", rating: "4.7", service: "Electrician" },
                    ].map((p, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
                        >
                            <h3 className="text-lg font-semibold">{p.name}</h3>
                            <p className="text-gray-500 text-sm">{p.service}</p>
                            <div className="mt-2 text-yellow-500 font-medium">
                                ⭐ {p.rating}
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            {/* Stats */}
            <section className="py-16 px-6 bg-gray-900 text-white">
                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h3 className="text-3xl font-bold">10k+</h3>
                        <p className="text-gray-300">Completed Bookings</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold">5k+</h3>
                        <p className="text-gray-300">Verified Providers</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold">98%</h3>
                        <p className="text-gray-300">Customer Satisfaction</p>
                    </div>
                </div>
            </section>


            {/* Testimonials */}
            <section className="py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-10">
                    What Customers Say
                </h2>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <p className="text-gray-600">
                            "Very fast booking and professional service!"
                        </p>
                        <span className="block mt-4 font-medium">- John D.</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <p className="text-gray-600">
                            "The provider arrived on time and did a great job."
                        </p>
                        <span className="block mt-4 font-medium">- Sara M.</span>
                    </div>
                </div>
            </section>


            {/* CTA */}
            <section className="py-20 px-6 text-center bg-gradient-to-r from-[var(--color-primary)] to-blue-800 text-white">
                <h2 className="text-3xl font-bold mb-6">
                    Ready to book your first service?
                </h2>

                <Link to="/services">
                    <Button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
                        Explore Services
                    </Button>
                </Link>
            </section>

        </div>
    );
}