
console.log(1)
      document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: '2021-11-07',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [
      {
        title: 'DSA',
        start: '2021-11-19T08:00:00.164+00:00'
      },
      {
        title: 'Long Event',
        start: '2021-11-07',
        end: '2021-11-10'
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2021-11-09T16:00:00'
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2021-11-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2021-11-11',
        end: '2021-11-13'
      },
      {
        title: 'Meeting',
        start: '2021-11-12T10:30:00',
        end: '2021-11-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2021-11-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2021-11-12T14:30:00'
      },
      {
        title: 'Birthday Party',
        start: '2021-11-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2021-11-28'
      }
    ]
  });

        calendar.render();
      });
