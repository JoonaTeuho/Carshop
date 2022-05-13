import React, { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AddCar from './AddCar';
import EditCar from './EditCar';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function Carlist() {
    // Tehdään state car olioita varten
    const [cars, setCars] = React.useState([]);

    // REST apista haku
    useEffect( () => {
        fetchCars();
    }, [])

    const fetchCars = () => {
        fetch(process.env.REACT_APP_API_URL)
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    }

    const updateCar = (updateCar, link) => {
        console.log("OLLAAN EDIT CAR FUNKTIOSSA");
        console.log("LINKKI: " + link);
        console.log("BRAND: " + updateCar.brand);
        fetch(link, {
            method: 'PUT',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(updateCar)
        })
        .then(response =>  {
            if(response.ok) {
                console.log("ONNISTUI");
                fetchCars();
            }else {
                alert('Something went wrong')
            }
        })
        .catch(err => console.error(err))
    }

    // AG grid toimii siten, että columns määrittää columnien nimet
    const columns = [
        { field: "brand", sortable: true, filter: true },
        { field: "model", sortable: true, filter: true },
        { field: "color", sortable: true, filter: true },
        { field: "fuel", sortable: true, filter: true },
        { field: "year", sortable: true, filter: true },
        { field: "price", sortable: true, filter: true },
        {
            headerName: '',
            width: 100,
            field: '_links.self.href',
            cellRenderer: params =>
                <EditCar updateCar={updateCar} params={params} />

        },
        {
            headerName: '',
            width: 100,
            field: '_links.self.href',
            cellRenderer: params =>
                <IconButton onClick={() => deleteCar(params.value)}>
                    <DeleteIcon />
                </IconButton>
         },
    ];  

    // Auton poisto
    const deleteCar = (link) => {
        console.log("OLLAAN DELETECAR FUNKTIOSSA");
        console.log(link);
        console.log("LINKKI LOPPU");
        fetch(link, { method: 'DELETE'})
            .then(response => {
                if(response.ok) {
                    fetchCars();
                }

            }) 
           
    }

    // Auton lisäys
    const addCar = (car) => {
        console.log("CARLISTIN ADDCAR FUNKTIO");
        fetch(process.env.REACT_APP_API_URL, {
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(car)
            })
            .then(response =>{
                if(response.ok) {
                    fetchCars();
                } else {
                    alert('Something went wrong when adding car');
                }
            })
            .catch(err => console.error(err))
    }

    

    return ( 

        <>
            <AddCar addCar={addCar} />
            <div className="ag-theme-material" style={{ height: 600, width: '90' }}>
            <AgGridReact
                rowData={cars}
                paginationPageSize={10}
                pagination={true}
                columnDefs={columns}>
            </AgGridReact>
            </div>
        </>

    );
}

export default Carlist;