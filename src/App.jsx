import { useEffect, useState } from 'react'
import './App.css'
import Modal from './components/Modal'
import { BASE_URL, EMPTY_FORM_VALUES } from './constants/users'
import Header from './components/Header'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import UsersList from './components/UsersList'

function App() {
  const [isShowModal, setIsShowModal] = useState(false)
  const [users, setUsers] = useState([])
  const [idUserToEdit, setIdUserToEdit] = useState(null)

  const {handleSubmit, register, reset, formState} = useForm()
  const {errors} = formState

  const submit = (data) => {
    if(idUserToEdit){
      updateUser(data)
    }else {
      createUser(data)
    }
  }

  const handleOpenModal = () => {
    setIsShowModal(true)
  }

  const handleCloseModal = () => {
    setIsShowModal(false)
    reset(EMPTY_FORM_VALUES)
    setIdUserToEdit(null)
  }

  const createUser = (data) => {
    axios
    .post(BASE_URL + "/users/", data)
    .then(() => {
      handleCloseModal()
      getAllUsers()
    })
    .catch((err) => console.log(err))
  }

  const deleteUser = (id) => {
    axios
      .delete(BASE_URL + `/users/${id}/`)
      .then(() => getAllUsers())
      .catch((err) => console.log(err))
  }

  const updateUser = (data) => {
    axios
    .put(BASE_URL + `/users/${idUserToEdit}/`, data)
    .then (() => {
      getAllUsers()
      handleCloseModal()
    })
    .catch((err) => console.log(err))
  }

  const handleClickEdit = (userToEdit) => {
    handleOpenModal()
    reset(userToEdit)
    setIdUserToEdit(userToEdit.id)
  }

  const getAllUsers = () => {
    axios
      .get(BASE_URL + "/users/")
      .then(({data}) => setUsers(data))
      .catch((err) => console.log(err))
  }

  useEffect(()=>{
    getAllUsers()
  }, [])

  return (
    <main className="min-h-screen font-[Changa]">
      <Header handleOpenModal={handleOpenModal}/>
      
      <Modal isShowModal={isShowModal} handleCloseModal={handleCloseModal} handleSubmit={handleSubmit} register={register} submit={submit} idUserToEdit={idUserToEdit} errors={errors}/>
      <UsersList users={users} deleteUser={deleteUser} handleClickEdit={handleClickEdit}/>
    </main>
  )
}

export default App
