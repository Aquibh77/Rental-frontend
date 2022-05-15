import Axios  from "axios";
import { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function AdminApp() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productAddIsOpen, setProductAddIsOpen] = useState(false);

  useEffect(() => {
    Axios
      .get('http://localhost:4000/api/admin/product')
      .then((response) => {
        setData(response.data)
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
            <NavBar productAddIsOpen={productAddIsOpen} setProductAddIsOpen={setProductAddIsOpen}/>
            <div style={{display: 'flex'}}>
                {
                    data.map((item) => <ProductItemBox item={item} />)
                }
            </div>
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
        <Popup trigger={<button> Add new Product </button>} open={props.productAddIsOpen} onOpen={() => props.setProductAddIsOpen(true)} onClose={() => props.setProductAddIsOpen(false)}
            position="bottom right">
            <AddProduct onClose={() => props.setProductAddIsOpen(false)}/>
            </Popup>
      </div>
    )
  }

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { id, name, duration, cost, category, url } = document.forms[0];

    Axios
      .post('http://localhost:4000/api/admin/product', {
            "id": id,
            "name": name,
            "duration": duration,
            "cost": cost,
            "category": category,
            "imageUrl": url
        }).then((response) => {
            console.log('done');
            // onClose()
        })
      .catch((error)=> {})
  };

  function AddProduct(props) {
      const [input, setInput] = useState({
          "id":  '',
          "name": '',
          "duration": '',
          "cost": '',
          "category": '',
          "imageUrl": ''
      });

      const onInputchange = (event) => {
        setInput({
          ...input, [event.target.name]: event.target.value
        });
      }

      return (
          <form onSubmit={handleSubmit}>
                <input name="id" placeholder="id" onChange={onInputchange}/>
                <input name="name" placeholder="Name" onChange={onInputchange}/>
                <input name="duration" placeholder="Duration" onChange={onInputchange}/>
                <input name="cost" placeholder="Cost" onChange={onInputchange}/>
                <input name="category" placeholder="Category" onChange={onInputchange}/>
                <input name="url" placeholder="Image url" onChange={onInputchange}/>
                <input type="submit" onClick/>
          </form>
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
      </div>
    )
  }

export default AdminApp