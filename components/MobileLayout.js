import BottomNav from './BottomNav';

const MobileLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <main className="flex-grow pb-24 md:pb-0">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};

export default MobileLayout;
