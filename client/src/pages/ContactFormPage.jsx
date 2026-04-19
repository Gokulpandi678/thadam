import React from 'react'
import Header from '../ui/molecules/header/Header'
import AddContactForm from '../features/customer/layout/AddContactForm'

const ContactFormPage = () => {
  return (
    <div>
      <Header title = "Add Contact" description="Your next valuable connection starts here"/>
      <AddContactForm />
    </div>
  )
}

export default ContactFormPage