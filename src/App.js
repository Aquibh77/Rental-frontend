import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Axios from 'axios';

function UserApp() {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterdData, setFilteredData] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cart, setCart] = useState([]);

  const filterDataBySearch = (value) => {
    var filteredDataValues = data.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
    setFilteredData(filteredDataValues)
  } 

  const filterDataByCategory = (value) => {
    console.log('value', value)
    var valueIndex = selectedCategories.indexOf(value);

    if (valueIndex > -1) {
      let tempSelectedCategories = selectedCategories;
      tempSelectedCategories.splice(valueIndex, 1)
      setSelectedCategories(tempSelectedCategories)
      filterDataByCategoryList(tempSelectedCategories)
    } else {
      let tempSelectedCategories = selectedCategories;
      tempSelectedCategories.push(value)
      setSelectedCategories(tempSelectedCategories)
      filterDataByCategoryList(tempSelectedCategories)
    }
  }

  const filterDataByCategoryList = (value) => {
    if( value.length === 0) {
      setFilteredData(data)
    } else {
      var filteredDataValues = data.filter((item) => {
        let flag = false;
  
        for (var i =0; i <value.length; i++) {
          if (item.category === value[i]) {
            flag = true;
            break;
          }
        }
  
        if (flag) return true
        return false;
  
      })
      setFilteredData(filteredDataValues)
    }
  }

  useEffect(() => {
    Axios
      .get('http://localhost:4000/api/user/product')
      .then((response) => {
        let categoryList =response.data.map(item => item.category)
        setData(response.data)
        setFilteredData(response.data)
        setCategory(categoryList)
        console.log(response.data)
        setIsLoading(false)
      })
      .catch((error)=> {
        setData([])
        setIsLoading(false)
      })
  }, []);

  if(isLoading) {
    return <div style={{textAlign: 'center'}}>
      Loading
    </div>
  }

  return (
    <div>
      <NavBar cart={cart}/>
      <div style={{display: 'flex'}}>
        <Sidebar onSearch={(value) => filterDataBySearch(value)} categoryList={category} onCategorySelectToggle={(value) => filterDataByCategory(value)}/>
        <div style={{display: 'flex'}}>
          {
            filterdData.map((item) => <ProductItemBox item={item} cart={cart} setCart={setCart}/>)
          }
        </div>
      </div>
    </div>
  );
}

function QuantityIndicator(props) {
  return (
    <div style={{
      display: 'flex',
    }}>
      <button onClick={() => props.onAdd()}>
        +
      </button>
      <div>
        {props.quantity}
      </div>
      <button onClick={() => props.onDelete()}>
        -
      </button>
    </div>
  )
}

function Sidebar(props) {
  return (
    <div style={{
      height: 'calc(100vh - 60px)',
      backgroundColor: '#f8f8ff',
      padding: '10px'
    }}>
      <input placeholder='Search' onChange={(e) => props.onSearch(e.target.value)}/>
      
      <h5 style={{marginTop: '10px'}}>Category</h5>
      {
        props.categoryList.map(item => <div>
          <input type="checkbox" id={item} name={item} onChange={(e) => {
            props.onCategorySelectToggle(item)
          }}/>
          <label for={item}>{item}</label>
        </div>)
      }
    </div>
  )
}

function NavBar(props) {
  return (
    <div style={{
      height: '40px',
      width: '100%',
      backgroundColor: 'lightblue',
      display: 'flex',
      justifyContent:'space-between'
    }}>
      <div>
        Rental
      </div>
      <button style={{
        padding : '5px',
        backgroundColor: 'black',
        color: 'white',
        display: props.cart.length > 0 ? 'block' : 'none'
      }}>
        Check out
      </button>
    </div>
  )
}

function ProductItemBox(props) {
  return (
    <div style={{
      height: "220px",
      width: '180px',
      backgroundColor: 'grey',
      margin: '10px',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <img height={"180px"} width= {'180px'} src={props.item.imageUrl}/>
      <ProductItemBoxBottomBar {...props}/>

    </div>
  )
}

function ProductItemBoxBottomBar(props) {
  let cartItemList = props.cart.filter(item => item.id === props.item.id)
  let cartItemnonItemList = props.cart.filter(item => item.id !== props.item.id) 
  
  const onAdd = () => {
    cartItemList.push(props.item)
    let newCartList = [...cartItemnonItemList, ...cartItemList]
    props.setCart(newCartList)
  } 

  const onDelete = () => {
    cartItemList.pop()
    let newCartList = [...cartItemnonItemList, ...cartItemList]
    props.setCart(newCartList)
  }

  return (
    <div style={{
      width: '180px',
      height: '40px',
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#f8f8ff',
    }}>
      <div>
        <div style={{fontSize: 14}}>{props.item.name}</div>
        <div style={{fontSize: 11}}>{props.item.duration} {props.item.cost}</div>
      </div>
      {
        cartItemList.length > 0 
          ? <QuantityIndicator onAdd={() => onAdd()} onDelete={() => onDelete()} quantity={cartItemList.length}/>
          : <ProductEmptyAddButton onClick={() => onAdd()}/>
      }
    </div>
  )
}

function ProductEmptyAddButton(props) {
  return (
    <button style={{
      width: '30px',
      height: '30px',
      backgroundColor: 'grey',
      marginRight: '5px',
      marginTop: '5px',
    }} onClick={(_) => props.onClick()}>
      <img height={'10px'} width={'10px'} src={'https://th.bing.com/th/id/R.dda3fc6f7d83ea641822a7b262c7510a?rik=WNH4e28WXxw3uQ&riu=http%3a%2f%2fclipart-library.com%2fimages_k%2fshopping-transparent-background%2fshopping-transparent-background-16.png&ehk=X%2bWo7p%2fGOANQznaE6q%2bJAsKdxPl3%2fdwr36WUcECCz2s%3d&risl=&pid=ImgRaw&r=0'}/>
    </button>
  )
}

export default UserApp;
