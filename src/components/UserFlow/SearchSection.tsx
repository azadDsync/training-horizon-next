import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SearchBarProps {
  keywords?: string;
  setKeywords?: React.Dispatch<React.SetStateAction<string>>;
  onSearch?: (searchKeywords: string) => void;
}

const SearchSection: React.FC<SearchBarProps> = ({
  keywords = "",
  setKeywords = () => { },
  onSearch = () => { },
}) => {
  return (
    <section className="bg-white/20 container mx-auto px-4 py-10">
      <div className="flex flex-row justify-end max-w-2xl mx-auto relative">
        <Input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Course Title..."
          className="w-full pl-4 pr-20 py-6 shadow-lg rounded-full"
        />
        <Button
          onClick={() => {
            onSearch(keywords);
          }}
          className="absolute bg-blue-500 hover:bg-blue-600 rounded-full py-6 px-8">
          Search
        </Button>
      </div>
    </section>
  );
};

export default SearchSection;