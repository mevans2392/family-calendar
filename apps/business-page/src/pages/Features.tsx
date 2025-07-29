import './Features.css';

export default function Features() {

  return (
    <div className="feature-wrapper">
      <div id="appFeatureCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#appFeatureCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#appFeatureCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#appFeatureCarousel" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#appFeatureCarousel" data-bs-slide-to="3"></button>
          <button type="button" data-bs-target="#appFeatureCarousel" data-bs-slide-to="4"></button>
          <button type="button" data-bs-target="#appFeatureCarousel" data-bs-slide-to="5"></button>
        </div>

        <div className="carousel-inner text-center">

          {/* calendar */}
          <div className="carousel-item active">
            <img src="/images/month-events.webp" className="carousel-image img-fluid mx-auto d-block" alt="calendar" />
            <div className="carousel-text mt-3">
              <h5>Organize Simply</h5>
              <p>
                Enter events for your entire family by pressing the days and entering events. View the events by clicking the title (or bubble on smaller screens). The
                calendar also switches to week or day views for a better look at upcoming events.
              </p>
            </div>
          </div>

          {/* chores */}
          <div className="carousel-item">
            <img src="/images/chores.webp" className="carousel-image img-fluid mx-auto d-block" alt="chores" />
            <div className="carousel-text mt-3">
              <h5>Who's Chore is it?</h5>
              <p>
                Never again argue over who is doing the laundry! Assign chores and point values (for earning rewards) to give even the most mundane of chores a flair.
                Simply drag the chores to the family member who is doing them. Press the check box to assign the chore's points to a user. Points are used for rewards.
              </p>
            </div>
          </div>

          {/* rewards */}
          <div className="carousel-item">
            <img src="/images/rewards.webp" className="carousel-image img-fluid mx-auto d-block" alt="rewards" />
            <div className="carousel-text mt-3">
              <h5>Pick Something Fun</h5>
              <p>
                Use the rewards feature to use all those points that you earned doing chores. What do you want to do? Pick the music on the next road trip? Choose the
                movie that everyone watches during movie night? The options are as limited as your imagination. Add some rewards then drag them to the person who
                wants to 'buy' that reward. Finally, do the fun thing that you 'purchased'.
              </p>
            </div>
          </div>

          {/* annual chores */}
          <div className="carousel-item">
            <img src="/images/annual-chores.webp" className="carousel-image img-fluid mx-auto d-block" alt="annual-chores" />
            <div className="carousel-text mt-3">
              <h5>Chores by Month</h5>
              <p>
                Don't forget the things that need to be done yearly. When creating a chore, you can choose which month the chore is done. View your yearly chores
                in the 'Annual Chores' screen so that you can see what is coming up. Chores automatically move to the unassigned chore bucket at the start of the month.
                For example, chores in the 'April' bucket will automatically move to the 'unassigned' bucket on the first of April.
              </p>
            </div>
          </div>

          {/* meal planner */}
          <div className="carousel-item">
            <img src="/images/meal-planner.webp" className="carousel-image img-fluid mx-auto d-block" alt="meals" />
            <div className="carousel-text mt-3">
              <h5>Meal Planner</h5>
              <p>
                Make a plan for meals! With SimplizityLife Calendar, it is easy to add a recipe into your recipe box. Add ingredients and instructions on how to make
                the meal. Inside of the recipe card, press the shopping cart to automatically add each ingreadient to your shopping list.
                When you are ready to schedule, drag the card to the day and meal of your choice to create a simple, visual meal schedule.
              </p>
            </div>
          </div>

          {/* shopping list */}
          <div className="carousel-item">
            <img src="/images/shopping-list.webp" className="carousel-image img-fluid mx-auto d-block" alt="shopping" />
            <div className="carousel-text mt-3">
              <h5>Going Shopping?</h5>
              <p>
                Running Errands? Don't rely on paper lists anymore. They could get lost, or wet. Then you're stuck trying to remember what you were going to the store
                to pick up. We always have our phones with us. Use the shopping list to add items and keep track of the items that you already have in your cart.
                When you're done shopping, delete your checked items and feel the satisfaction as shopping disappears from your to-do list.
              </p>
            </div>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#appFeatureCarousel" data-bs-slide="prev">
          <i className="bi bi-chevron-left text-success fs-1"></i>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#appFeatureCarousel" data-bs-slide="next">
          <i className="bi bi-chevron-right text-success fs-1"></i>
        </button>

      </div>
    </div>
  );

}
