import { useState } from "react";
import {
  Box,
  Button,
  Textarea,
  VStack,
  Heading,
  List,
  ListItem,
} from "@chakra-ui/react";
import {
  getCategories,
  AIStyle,
  AICategoryOptions,
} from "./logic/get-categories";
import { Category } from "./types/category";

function App() {
  const [input, setInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [style, setStyle] = useState<AIStyle | undefined>(undefined);
  const [categoryHint, setCategoryHint] = useState("");
  const [categoriesInput, setCategoriesInput] = useState("");
  const [excludeCategoriesInput, setExcludeCategoriesInput] = useState("");
  const [classHint, setClassHint] = useState("");

  const handleCategorize = async () => {
    setLoading(true);
    const options: AICategoryOptions = {
      style,
      categoryHint: categoryHint || undefined,
      categories: categoriesInput
        ? categoriesInput.split(",").map((c) => c.trim())
        : undefined,
      excludeCatories: excludeCategoriesInput
        ? excludeCategoriesInput.split(",").map((c) => c.trim())
        : undefined,
      classHint: classHint ?? undefined,
    };
    const objects = input.split("\n").map((obj) => obj.trim());
    const result = await getCategories(objects, "ai", options);
    setCategories(result);
    setLoading(false);
  };

  return (
    <VStack spacing={4} p={4}>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter objects separated by newlines"
        size="md"
      />
      <Button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
        {showAdvancedOptions
          ? "Hide Advanced Options"
          : "Show Advanced Options"}
      </Button>
      {showAdvancedOptions && (
        <>
          <Textarea
            value={classHint}
            onChange={(e) => setClassHint(e.target.value)}
            placeholder="Enter a class hint"
            size="md"
          />
          <Textarea
            value={categoryHint}
            onChange={(e) => setCategoryHint(e.target.value)}
            placeholder="Enter a category hint"
            size="md"
          />
          <Textarea
            value={categoriesInput}
            onChange={(e) => setCategoriesInput(e.target.value)}
            placeholder="Enter categories separated by commas"
            size="md"
          />
          <Textarea
            value={excludeCategoriesInput}
            onChange={(e) => setExcludeCategoriesInput(e.target.value)}
            placeholder="Enter categories to exclude separated by commas"
            size="md"
          />
          <Button
            colorScheme={style === AIStyle.funny ? "orange" : "teal"}
            onClick={() =>
              setStyle(
                style === AIStyle.funny ? AIStyle.serious : AIStyle.funny
              )
            }
          >
            Toggle Style: {style === AIStyle.funny ? "Funny" : "Serious"}
          </Button>
        </>
      )}
      <Button colorScheme="teal" onClick={handleCategorize} mt={4}>
        {loading ? "Loading..." : "Get Categories"}
      </Button>
      <Box w="100%">
        {categories.map((category) => (
          <Box
            key={category.name}
            p={4}
            borderWidth={1}
            borderRadius="md"
            mb={4}
          >
            <Heading size="md">{category.name}</Heading>
            <List spacing={2}>
              {category.objects.map((obj) => (
                <ListItem key={obj}>{obj}</ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </VStack>
  );
}

export default App;
