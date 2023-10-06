import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../index";
import {Button, Container, HStack,Radio,RadioGroup,} from "@chakra-ui/react";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";
import CoinCard from "./CoinCard";



const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] =useState(false);
  const [page,setPage]= useState(1);
  const [currency,setCurrency]= useState("inr");

  const currencySymbol =
  currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const changePage =(page)=>{
     setPage(2);
     setLoading(true);
  }
  
const btns = new Array(132).fill(1);  // buttons needed for pagenatinon , as we have about 13000 coins at api , and we are fetching 100 coins per page so there will be abut 130 pages

useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`);
        setCoins(data);
         setLoading(false);
      } catch (error) {
         setError(true);
         setLoading(false);
      }
    };

    fetchCoins();
  }, [currency,page]);
   
 if(error) return <ErrorComponent message={"Error while fectching coins"}/>

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
  
        <>
      <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
        <HStack spacing={"4"}>
             <Radio value={"inr"}>INR</Radio>
             <Radio value={"usd"}>USD</Radio>
             <Radio value={"eur"}>EUR</Radio>
        </HStack>
       </RadioGroup>

         <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
            {coins.map((i) => (
              <CoinCard
                id={i.id}
                key={i.id}
                name={i.name}
                img={i.image}
               price={i.current_price}
               symbol={i.symbol}
              currencySymbol={currencySymbol}
              />
            ))}
          </HStack>

           <HStack w={"full"} overflow={"auto"} p={"8"}>
               {btns.map((item,index)=>(
                
                <Button 
                bgColor={"blackAlpha.800"} 
                color={"white"}
                key={index}
                onClick={()=>changePage(index+1)}
                 >
                 {index+1}
             </Button>
               ))
               }
               
           </HStack>

        </>
      )}
    </Container>
  );
};



export default Coins;
