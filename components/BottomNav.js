import Link from 'next/link';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react'; // Assuming lucide-react or similar icon lib is available or we use svg

const BottomNav = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-4 shadow-lg z-50 md:hidden">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-primary active:text-primary transition-colors">
                    <Home size={24} />
                    <span className="text-[10px] mt-1 font-medium">Home</span>
                </Link>
                <Link href="/search" className="flex flex-col items-center text-gray-500 hover:text-primary active:text-primary transition-colors">
                    <Search size={24} />
                    <span className="text-[10px] mt-1 font-medium">Search</span>
                </Link>
                <Link href="/cart" className="flex flex-col items-center text-gray-500 hover:text-primary active:text-primary transition-colors relative">
                    <div className="relative">
                        <ShoppingBag size={24} />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
                    </div>
                    <span className="text-[10px] mt-1 font-medium">Cart</span>
                </Link>
                <Link href="/wishlist" className="flex flex-col items-center text-gray-500 hover:text-primary active:text-primary transition-colors">
                    <Heart size={24} />
                    <span className="text-[10px] mt-1 font-medium">Wishlist</span>
                </Link>
                <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-primary active:text-primary transition-colors">
                    <User size={24} />
                    <span className="text-[10px] mt-1 font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
};

export default BottomNav;
