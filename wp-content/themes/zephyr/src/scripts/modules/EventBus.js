/**
 *
 * Event Bus
 *
 * Pub/Sub system for custom event communication between modules.
 *
 * Exports a single EventBus instance, as well as a factory function 
 * for implementing pub/sub functionality into individual objects
 *
 */

function factory() {

  const topics = {};

  const EventBus = {

    /**
     *
     * Subscribe to topic, passing a callback function
     *
     * @param {string} topic - event name to subscribe to. You can subscribe to multiple custom events at once by entering the event names separated by a space.
     * eg: 'event1 event2 ...'
     * @param {function} listener - Callback function when event gets published
     *
     * @returns {object} Cancellable subscription object.
     *
     * 
     */

    subscribe(topic, listener) {

      topic = topic.split(' ')

      // Create object to hold topics and their indexes
      let current = {};
      
      topic.map( item => {
        // Create the topic's object if not yet created
        if(!topics.hasOwnProperty(item)) {
          topics[item] = [];
        }

        // Add the listener to queue
        let index = topics[item].push(listener) -1;

        current[item] = index;
      });
      

      // Provide handle back for removal of topic
      return {
        remove() {
          // Go through current list and get their indexes to delete
          for ( var item in current ) {
            delete topics[ item ][ current[item] ];
          }
        }
      };
    },



    /**
     *
     * Trigger event
     *
     * @param {string} topic - event name to publish
     * @param {...*} args - Any number of custom data to be passed to the callback
     * 
     */
    
    publish(topic) {

      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if(!topics.hasOwnProperty(topic)) {
        return;
      }

      topics[topic].forEach((item) => {
        item.apply(null, Array.prototype.slice.call(arguments, 1));
      });
    }
  };

  return EventBus

}

export const eventBusFactory = factory

export default factory()
