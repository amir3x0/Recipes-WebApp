import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
    const year = new Date().getFullYear();

    const fadeIn = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <footer className="relative mt-16 text-gray-600 dark:text-gray-300">
            {/* top accent line */}
            <div
                className="absolute inset-x-0 -top-1 h-1 bg-gradient-to-r from-fuchsia-500 via-orange-400 to-rose-500 rounded-full blur-[1px]"
                aria-hidden="true"
            />

            <div className="container mx-auto px-6">
                <div className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-10">
                        <motion.div variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }}>
                            <Link to="/" className="inline-flex items-center gap-2 group">
                                <span className="text-2xl font-extrabold bg-gradient-to-r from-rose-500 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent">
                                    Yummy
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                    2025
                                </span>
                            </Link>
                            <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                Crafted with a love for great food as part of Web learning. Explore recipes, plan meals, and share your creations.
                            </p>
                        </motion.div>

                        

                        <motion.div variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }} className="md:col-span-1">
                            <h3 className="text-sm font-semibold tracking-wider text-gray-900 dark:text-white">Contact</h3>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li>
                                    <a className="hover:text-rose-500 transition-colors" href="mailto:Amir.Mishayev@e.braude.ac.il">Amir.Mishayev@e.braude.ac.il</a>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }} className="md:col-span-1">
                            <h3 className="text-sm font-semibold tracking-wider text-gray-900 dark:text-white">Stay in the loop</h3>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Get tasty updates and new recipes occasionally.</p>
                            <form
                                className="mt-4 flex items-center gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-400"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white shadow hover:shadow-md transition-shadow"
                                >
                                    Subscribe
                                </button>
                            </form>

                                            <div className="mt-6 flex items-center gap-4 text-xl">
                                                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-rose-500 transition-colors">
                                    <FaFacebook />
                                </a>
                                                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-rose-500 transition-colors">
                                    <FaInstagram />
                                </a>
                                                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-rose-500 transition-colors">
                                    <FaTwitter />
                                </a>
                                <a href="https://github.com/amir3x0" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-rose-500 transition-colors">
                                    <FaGithub />
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    <div className="border-t border-gray-200/60 dark:border-white/10 px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            © {year} Yummy • All rights reserved.
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="mr-2">Made with</span>
                            <span className="text-rose-500">♥</span>
                            <span className="ml-2">and React</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
