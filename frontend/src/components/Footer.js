export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-black to-purple-800 text-purple-200 p-10 my-10">
            <div className="flex flex-wrap justify-center items-center max-w-6xl mx-auto">
                
                <div className="w-full md:w-1/3 flex justify-center items-center">
                    <div>
                        <p className="font-bold text-xl mb-4">Braude Web Course</p>
                        <p>This website is a result of a web course homework. It's made out of pure love and desire for food.</p>
                        <p className="mt-2">Made in 12\02\2024.</p>
                    </div>
                </div>
                
                <div className="w-full md:w-1/3 flex justify-center items-center">
                    <div>
                        <p className="font-bold text-xl mb-4">Contact</p>
                        <p>
                            Amir: Amir.Mishayev@e.braude.ac.il<br/>
                            Dana: Dana.Soudry@e.braude.ac.il<br/>
                            Lital: lital.leschinsky@e.braude.ac.il<br/>
                            Michael: Michael.Trifonov@e.braude.ac.il
                        </p>
                    </div>
                </div>
                
                <div className="w-full md:w-1/3 flex justify-center items-center">
                    <div>
                        <p className="font-bold text-xl mb-4">Social</p>
                        <p>
                            Facebook<br/>
                            Instagram<br/>
                            Twitter
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
