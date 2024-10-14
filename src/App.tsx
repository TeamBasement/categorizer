import "./App.css";
import React, { useState } from "react";
import { Box, Button, Input, Textarea, VStack, Heading, List, ListItem } from "@chakra-ui/react";
import { getCategories } from "./logic/get-categories";
import { Category } from "./types/category";

function App() {
  const [input, setInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const handleCategorize = async () => {
    const objects = input.split(",").map((obj) => obj.trim());
    const result = await getCategories(objects, "ai");
    setCategories(result);
  };

  return (
    <VStack spacing={4} p={4}>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter objects separated by commas"
        size="md"
      />
      <Button colorScheme="teal" onClick={handleCategorize}>
        Get Categories
      </Button>
      <Box w="100%">
        {categories.map((category) => (
          <Box key={category.name} p={4} borderWidth={1} borderRadius="md" mb={4}>
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
