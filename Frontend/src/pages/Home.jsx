import { Link } from "react-router-dom";
import Button from "../components/Button";
import VantaBackGround from "../components/BG/VantaBackGround";

export default function Home() {
    return (
        <div>

            {/* Hero Section */}
            <section className="heroSection center">
                <VantaBackGround />
                <div className="heroContent">
                    <h1>Serviaura</h1>
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


            {/* Categories Section */}
            <section className="categories_section">
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
                    Explore Services
                </h2>

                <div className="Products_container center">
                    {["Home Repair", "Cleaning", "Beauty", "Tech Support"].map((cat, index) => (
                        <div key={index} className="center card">
                            <h3 className="title">{cat}</h3>
                        </div>
                    ))}
                </div>
            </section>


            {/* Why Choose Us */}
            <section style={{ background: "#f9fafb" }}>
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
                    Why Choose Serviaura?
                </h2>

                <div className="Products_container">
                    <div className="boxLayout_container productCard ">
                        <div className="center h-full flex-col">
                            <i className="fa-solid fa-user-check text-[var(--color-primary)] text-4xl" ></i>
                            <h3>Verified Providers</h3>
                            <p>Trusted professionals for every service.</p>
                        </div>
                    </div>

                    <div className="boxLayout_container productCard">
                        <div className="center h-full flex-col">
                            <i className="fa-solid fa-bolt text-[var(--color-primary)] text-4xl"></i>
                            <h3>Quick Booking</h3>
                            <p>Book services in just a few clicks.</p>
                        </div>
                    </div>

                    <div className="boxLayout_container productCard">
                        <div className="center h-full flex-col">
                            <i className="fa-solid fa-headset text-[var(--color-primary)] text-4xl"></i>
                            <h3>24/7 Support</h3>
                            <p>We're always here to assist you.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section style={{
                padding: "4rem 2rem",
                textAlign: "center",
            }}>
                <h2 style={{ marginBottom: "1.5rem" }}>
                    Ready to Book a Service?
                </h2>

                <div style={{ width: "15rem", margin: "0 auto" }}>
                    <Link to="/services">
                        <Button style={'btn-secondary'}>
                            Explore Services
                        </Button>
                    </Link>
                </div>
            </section>

        </div>
    );
}