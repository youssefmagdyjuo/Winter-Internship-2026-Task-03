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
                    <h1>Viteruca</h1>
                    <p>
                        Discover premium products at unbeatable prices.
                        Quality, speed, and trust — all in one place.
                    </p>

                    <div style={{ width: "15rem" }}>
                        <Link to="/products">
                            <Button style={'btn-primary'}>
                                <div className="flex gap-2 items-center justify-center">
                                    <i className="fa-solid fa-bag-shopping"></i>
                                    <span>Shop Now</span>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>


            {/* Categories Section */}
            <section className="categories_section">
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
                    Shop by Category
                </h2>

                <div className="Products_container">
                    {["Electronics", "Fashion", "Home", "Sports"].map((cat, index) => (
                        <div key={index} className="center card">
                            <h3 className="title">{cat}</h3>
                        </div>
                    ))}
                </div>
            </section>


            {/* Why Choose Us */}
            <section style={{ padding: "3rem 2rem", background: "#f9fafb" }}>
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
                    Why Choose Viteruca?
                </h2>

                <div className="Products_container">
                    <div className="boxLayout_container productCard ">
                        <div className="center h-full flex-col">
                            <i className="fa-solid fa-truck text-[var(--color-primary)] text-4xl" ></i>
                            <h3>Fast Delivery</h3>
                            <p>Quick and reliable shipping.</p>
                        </div>
                    </div>

                    <div className="boxLayout_container productCard">
                        <div className="center h-full flex-col">
                            <i className="fa-solid fa-shield-halved text-[var(--color-primary)] text-4xl"></i>
                            <h3>Secure Payment</h3>
                            <p >100% protected transactions.</p>
                        </div>
                    </div>

                    <div className="boxLayout_container productCard">
                        <div className="center h-full flex-col">
                            <i className="fa-solid fa-headset text-[var(--color-primary)] text-4xl"></i>
                            <h3>24/7 Support</h3>
                            <p>We're always here to help.</p>
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
                    Ready to Start Shopping?
                </h2>

                <div style={{ width: "15rem", margin: "0 auto" }}>
                    <Link to="/products">
                        <Button style={'btn-secondary'}>
                            Explore Products
                        </Button>
                    </Link>
                </div>
            </section>

        </div>
    );
}