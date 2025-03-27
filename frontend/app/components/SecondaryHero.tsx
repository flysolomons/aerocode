export default function SecondaryHero() {
    return (
        <div className="h-[400px] bg-cover bg-center" style={{
            backgroundImage: "url('./hero.jpg')"
        }}>
            <div className="flex items-center justify-center h-full text-white bg-black bg-opacity-50 p-4 rounded-lg">
                <div className="text-center">
                    <span className="text-[48px] font-bold font-sans">Explore</span>
                    <p>Home &gt; Explore</p>
                </div>
            </div>
        </div>
    );
}

// props: breadcrumbs, page title, hero image