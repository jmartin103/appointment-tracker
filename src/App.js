import { useState, useEffect, useCallback } from 'react';
import { BiArchive } from 'react-icons/bi';
import Search from './components/Search';
import AddAppointment from './components/AddAppointment';
import AppointmentList from './components/AppointmentList';

function App() {
  let [apptList, setApptList] = useState([]);
  let [query, setQuery] = useState('');
  let [sortBy, setSortBy] = useState('petName');
  let [orderBy, setOrderBy] = useState('asc');

  const fetchAppts = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setApptList(data)
      });
  }, [])

  const filteredAppts = apptList.filter(
    item => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) || 
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    }
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) ? -1 * order : 1 * order 
    )
  })

  useEffect(() => {
    fetchAppts()
  }, [fetchAppts])

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl">
        <BiArchive className="inline-block text-red-400 align-top" />Your Appointments  
      </h1>
      <Search query={query} 
        onQueryChange={(searchQuery) => setQuery(searchQuery)}
        orderBy={orderBy}
        onOrderByChange={searchOrder => setOrderBy(searchOrder)}
        sortBy={sortBy}
        onSortByChange={searchSort => setSortBy(searchSort)} />
      <AddAppointment
        onSendAppt = {newAppointment => setApptList([...apptList, newAppointment])}
        lastId = {apptList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppts.map(appointment => (
          <AppointmentList key={appointment.id} 
            appointment={appointment}
            onDeleteAppt={
              appointmentId => {
                setApptList(apptList.filter(appointment => 
                  appointment.id !== appointmentId))
              }
            } />
        ))}
      </ul>
    </div>
  );
}

export default App;
