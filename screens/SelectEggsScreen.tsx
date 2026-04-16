import EggsList from '@/components/EggList/EggsList';
import { useStore } from '@/context/StoreContext';

export default function SelectEggsScreen() {
    const { eggs } = useStore();
    return <EggsList items={eggs} />;
}
