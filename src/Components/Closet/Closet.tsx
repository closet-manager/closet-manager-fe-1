import { Card } from "../Card/Card";
import "./Closet.css";
import { useState, useEffect } from "react";
import { filterItems, getAllItems} from "../../apiCall"

interface attributes {
  season: string;
  clothing_type: string;
  size: string;
  color: string;
  image_url: string;
  notes: string;
}

interface Item {
  id: number;
  type: string;
  attributes: attributes;
}

export const Closet = (): JSX.Element => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); 
  const [fetchError, setFetchError] = useState<boolean>(false); 

  useEffect(() => {
    getAllItems()
      .then((response) => {
        setAllItems(response.data)
        setFilteredItems(response.data)
        setFetchError(false)
        console.log("All Items:", allItems)
      })
      .catch((Error)  => {
        console.log("All Items Fetch Error")
        setFetchError(true)
        setAllItems([])
        setFilteredItems([])
      })
  }, [])

  const mappedItems = filteredItems.map((item: Item): JSX.Element => {
    return (
      <Card key={item.id} id={item.id} image={item.attributes.image_url} />
    );
  });

  const handleFilter = async (): Promise<void> => {
    const type = document.querySelector<HTMLSelectElement>(
      "#filter--clothing-type"
    )!;
    const color = document.querySelector<HTMLSelectElement>("#filter--color")!;
    const favorite =
      document.querySelector<HTMLSelectElement>("#filter--favorite")!;
    const season =
      document.querySelector<HTMLSelectElement>("#filter--season")!;

    const queries = [
      { name: "season", value: season.value },
      { name: "type", value: type.value },
      { name: "color", value: color.value },
      { name: "favorite", value: favorite.value },
    ];
    const truthyQueries = queries.filter(({ value }) => value);
    const queriesString = truthyQueries
      .map(({ name, value }) => `${name}=${value}`)
      .join("&");

    const url = `https://closet-manager-be.herokuapp.com/api/v1/users/1/items/find_all?${queriesString}`;

    filterItems(url)
      .then((response) => {
        console.log("Filtered Items:", response)
          setFilteredItems(response.data)
          setFetchError(false)
        })
      .catch((Error)  => {
        console.log("Filter Fetch Error")
        setFetchError(true)
        setFilteredItems([])
      })
  };

  return (
    <div>
      <h2>My Closet</h2>
      <div id="filter" onChange={handleFilter}>
        <select id="filter--clothing-type" name="type">
          <option value="">Clothing Type</option>
          <option value="tops">Tops</option>
          <option value="bottoms">Bottoms</option>
          <option value="outerwear">Outerwear</option>
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>
        <select id="filter--color" name="color">
          <option value="">Color</option>
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="neutral">Neutral</option>
          <option value="other">Multi</option>
        </select>
        <select id="filter--season" name="season">
          <option value="">Season</option>
          <option value="fall">Fall</option>
          <option value="winter">Winter</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
        </select>
        <select id="filter--favorite" name="favorite">
          <option value="">See All</option>
          <option value="favorites">Only Favorites</option>
        </select>
      </div>
      {fetchError && <p>Unable to get items. Please try again later"</p>}
      {filteredItems.length === 0 && <p>No Items Found</p>}
      <div className="cards-container">{mappedItems}</div>
    </div>
  );
};
