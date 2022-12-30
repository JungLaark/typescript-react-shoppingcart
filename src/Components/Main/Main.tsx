import { useState } from 'react';
import { useQuery } from 'react-query';
//component
import Item from '../Item/Item';
import Cart from './../../Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';
//styles
import { Wrapper, StyledButton  } from './Main.styles';
import { stringify } from 'querystring';
//types
import { CartItemType } from '../../Model/CartItemType';


const getProducts = async (): Promise<CartItemType[]> => {
    return await (await fetch('https://fakestoreapi.com/products')).json();
}

const Main = () => {

    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([] as CartItemType[]);

    /*그냥 hook*/
    const { data, isLoading, error } = useQuery<CartItemType[]>(
        'products',
        getProducts
    );

    const getTotalItems = (items: CartItemType[]) => {
        items.reduce((ack: number, items) => ack + items.amount, 0) ;
    }
    const handleAddToCart = (clickedItem: CartItemType) => {
        setCartItems(prev => {
            //1. is the item already added in the cart?
            const isItemInCart = prev.find(item => item.id === clickedItem.id);

            if(isItemInCart){
                return prev.map(item=>(
                    item.id === clickedItem.id ? {...item, amount: item.amount + 1}
                                               : item
                ))
            }
            //2. First time the add is added
            return [...prev, {...clickedItem, amount: 1}]
        })
    }

    const handleRemoveFromCart = (id: number) => {
        setCartItems(prev => (
            prev.reduce((ack, item) => {
                if(item.id === id){
                    if(item.amount === 1) {
                        return ack;
                    }
                    return [...ack, {...item, amount: item.amount - 1}]

                }else{
                    return [...ack, item];
                }
            }, [] as CartItemType[])
        ))
    }

    if (isLoading) {
        return <LinearProgress />;
    }

    if (error) {
        return <div>뭔가 잘못되었습니다.</div>
    }


    return (
        <Wrapper>
            <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
                <Cart cartItems={cartItems}
                     addToCart={handleAddToCart}
                     removeFromCart={handleRemoveFromCart}/>
            </Drawer>
            <StyledButton onClick={() => setCartOpen(true)}>
                <Badge badgeContent={getTotalItems(cartItems)} color='error'>
                    <AddShoppingCartIcon/>
                </Badge>
            </StyledButton>
            <Grid container spacing={3}>
                {data?.map(item => (
                    <Grid item key={item.id} xs={12} sm={4}>
                        <Item item={item} handleAddToCart={handleAddToCart}></Item>
                    </Grid>
                ))}
            </Grid>
        </Wrapper>
    )
}

export default Main;