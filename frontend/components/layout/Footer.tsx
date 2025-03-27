function Footer() {
    const isProd = process.env.NODE_ENV === 'production';
    return (
        <footer className="bg-[#1A194D] text-white pt-8">
            <div className="container mx-auto px-4 max-w-[1128px]">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                    {/* Services Column */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Services</h3>
                        <ul className="space-y-2 text-xs font-normal">
                            <li><a href="/book">Book a Trip</a></li>
                            <li><a href="/manage">Manage Booking</a></li>
                            <li><a href="/cargo">Cargo Information</a></li>
                        </ul>
                    </div>

                    {/* Destinations Column */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Destinations</h3>
                        <ul className="space-y-2 text-xs font-normal">
                            <li><a href="/flights/brisbane">Flights to Brisbane</a></li>
                            <li><a href="/flights/auckland">Flights to Auckland</a></li>
                            <li><a href="/flights/port-vila">Flights to Port Vila</a></li>
                            <li><a href="/flights/santo">Flights to Santo</a></li>
                            <li><a href="/flights/munda">Flights to Munda</a></li>
                            <li><a href="/flights/gizo">Flights to Gizo</a></li>
                        </ul>
                    </div>

                    {/* Policies Column */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Policies</h3>
                        <ul className="space-y-2 text-xs font-normal">
                            <li><a href="/baggage">Baggage Information</a></li>
                            <li><a href="/conditions">Conditions of Carriage</a></li>
                            <li><a href="/fare-conditions">Fare Conditions</a></li>
                            <li><a href="/terms">Terms of Service</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Company</h3>
                        <ul className="space-y-2 text-xs font-normal">
                            <li><a href="/about">About</a></li>
                            <li><a href="/careers">Careers</a></li>
                            <li><a href="/news">News</a></li>
                        </ul>
                    </div>

                    {/* Help Column */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Help</h3>
                        <ul className="space-y-2 text-xs font-normal">
                            <li><a href="/contact">Contact us</a></li>
                            <li><a href="/alerts">Travel Alerts</a></li>
                        </ul>
                    </div>

                    {/* Follow Us Column */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Follow Us</h3>
                        <div className="space-x-4">
                            <a href="https://facebook.com" aria-label="Facebook">
                                <span className="sr-only">Facebook</span>
                                {/* Add Facebook icon */}
                            </a>
                            <a href="https://youtube.com" aria-label="YouTube">
                                <span className="sr-only">YouTube</span>
                                {/* Add YouTube icon */}
                            </a>
                            <a href="https://instagram.com" aria-label="Instagram">
                                <span className="sr-only">Instagram</span>
                                {/* Add Instagram icon */}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-xs">
                    <p>Solomon Airlines. All Rights Reserved</p>
                </div>
            </div>
            {isProd ? (
                <div className="h-[86px] w-full bg-[url('/demo/design.svg')] bg-repeat-x mt-8 [background-size:422px_86px]" aria-hidden="true">
                </div>
            ) : (
                <div className="h-[86px] w-full bg-[url('/design.svg')] bg-repeat-x mt-8 [background-size:422px_86px]" aria-hidden="true">
                </div>
            )}
        </footer>
    );
}

export default Footer;