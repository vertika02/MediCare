
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()

  const [appointment, setAppointment] = useState([])
  const [loading, setLoading] = useState(false)

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointemmnt = async () => {
    try {
      setLoading(true)

      const { data } = await axios.get(
        backendUrl + '/api/user/appointments',
        { headers: { token } }
      )

      if (data.success) {
        setAppointment(data.appointment.reverse())
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true)

      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointments',
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)

        setAppointment(prevAppointments =>
          prevAppointments.map(apt =>
            apt._id === appointmentId
              ? { ...apt, cancelled: true }
              : apt
          )
        )

        getDoctorsData()

        setTimeout(() => {
          getUserAppointemmnt()
        }, 500)

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (item) => {

    if (item.cancelled) {
      return {
        status: 'Cancelled',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: '❌'
      }
    }

    if (item.isCompleted) {
      return {
        status: 'Completed',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: '✅'
      }
    }

    return {
      status: 'Scheduled',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      icon: '⏰'
    }
  }

  const formatDate = (slotDate) => {
    const formatted = slotDateFormat(slotDate)
    const today = new Date()
    const appointmentDate = new Date(formatted)

    const diffTime = appointmentDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return { text: formatted, badge: 'Today' }
    if (diffDays === 1) return { text: formatted, badge: 'Tomorrow' }
    if (diffDays > 0) return { text: formatted, badge: `In ${diffDays} days` }

    return { text: formatted, badge: 'Past' }
  }

  const handleBookAppointment = () => {
    navigate('/doctors')
  }

  useEffect(() => {
    if (token) {
      getUserAppointemmnt()
    }
  }, [token])

  if (loading && appointment.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading your appointments...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          My Appointments
        </h1>

        <p className="text-gray-600">
          Manage your scheduled medical appointments
        </p>

        {appointment.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">

            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Total: {appointment.length}
            </span>

            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Completed: {appointment.filter(apt => apt.isCompleted).length}
            </span>

            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Upcoming: {appointment.filter(apt => !apt.cancelled && !apt.isCompleted).length}
            </span>

          </div>
        )}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">

        {appointment.length === 0 ? (

          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">

            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-3 3v11a2 2 0 002 2h8a2 2 0 002-2V10l-3-3" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No appointments yet
            </h3>

            <p className="text-gray-600 mb-6">
              You haven't scheduled any appointments. Book your first consultation today!
            </p>

            <button
              onClick={handleBookAppointment}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book Appointment
            </button>

          </div>

        ) : (

          appointment.map((item, index) => {

            const statusInfo = getStatusInfo(item)
            const dateInfo = formatDate(item.slotDate)

            return (

              <div
                key={item._id || index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >

                <div className="p-6">

                  <div className="flex flex-col lg:flex-row gap-6">

                    {/* Doctor Image */}
                    <div className="flex-shrink-0">
                      <div className="relative">

                        <img
                          className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover border-2 border-gray-200"
                          src={item.docData.image}
                          alt={item.docData.name}
                        />

                        <div className="absolute -top-2 -right-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                            {statusInfo.icon} {statusInfo.status}
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">

                        <div>

                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {item.docData.name}
                          </h3>

                          <p className="text-blue-600 font-medium mb-2">
                            {item.docData.speciality}
                          </p>

                          {/* Date and Time */}
                          <div className="flex items-center gap-2 mb-3">

                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-3 3v11a2 2 0 002 2h8a2 2 0 002-2V10l-3-3" />
                            </svg>

                            <div>

                              <span className="text-sm font-semibold text-gray-900">
                                {dateInfo.text}
                              </span>

                              <span className="ml-2 text-sm text-blue-600 font-medium">
                                at {item.slotTime}
                              </span>

                              {dateInfo.badge && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  {dateInfo.badge}
                                </span>
                              )}

                            </div>
                          </div>

                          {/* Address */}
                          <div className="flex items-start gap-2 mb-3">

                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>

                            <div className="text-sm text-gray-600">
                              <p>{item.docData.address.line1}</p>
                              <p>{item.docData.address.line2}</p>
                            </div>

                          </div>

                        </div>

                        {/* Consultation Fee */}
                        {item.amount && (
                          <div className="text-right mt-4 sm:mt-0">
                            <p className="text-sm text-gray-500">
                              Consultation Fee
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              ₹{item.amount}
                            </p>
                          </div>
                        )}

                      </div>

                      {/* Cancel Appointment Button */}
                      <div className="flex flex-wrap gap-3">

                        {!item.cancelled && !item.isCompleted && (
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >

                            {loading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a7.962 7.962 0 014-7.938V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel Appointment
                              </>
                            )}

                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            )
          })

        )}

      </div>

    </div>
  )
}

export default MyAppointments
