const Meal = require('../models/Meal');

// Simple meal suggestions based on BMI category
function suggestionsForBMI(bmi){
  if(!bmi) return [];
  if(bmi < 18.5){
    return [
      { title: 'Peanut Butter Banana Smoothie', reason: 'High-calorie, healthy fats & protein' },
      { title: 'Avocado Toast with Eggs', reason: 'Calorie-dense with good fats and protein' }
    ];
  } else if (bmi < 22){
    return [
      { title: 'Greek Yogurt with Granola & Honey', reason: 'Balanced calories and protein' },
      { title: 'Chicken Rice Bowl with Olive Oil', reason: 'Good mix of carbs and protein' }
    ];
  } else {
    // overweight -> weight loss recommendations
    return [
      { title: 'Grilled Salmon & Veggies', reason: 'High protein, low calorie' },
      { title: 'Quinoa Salad with Chickpeas', reason: 'Fibre and protein-rich' }
    ];
  }
}

exports.addMeal = async (req, res) => {
  try {
    const { name, calories, date, notes } = req.body;
    const meal = await Meal.create({ user: req.userId, name, calories, date, notes });
    res.json(meal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMealsByDate = async (req, res) => {
  try {
    const { date } = req.query; // expected YYYY-MM-DD
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const meals = await Meal.find({ user: req.userId, date: { $gte: start, $lt: end } }).sort('date');
    const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
    // get user's BMI (populating user would be extra query; instead calculate if available)
    const user = await require('../models/User').findById(req.userId);
    let bmi = null;
    if(user && user.heightCm && user.weightKg){
      bmi = +(user.weightKg / ((user.heightCm/100)**2)).toFixed(1);
    }
    const suggestions = suggestionsForBMI(bmi);
    res.json({ meals, totalCalories, bmi, suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    await Meal.findOneAndDelete({ _id: id, user: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
