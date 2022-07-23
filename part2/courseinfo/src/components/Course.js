import React from "react";

const Header = ({ course }) => <h2>{course.name}</h2>;

const Total = ({ course }) => {
  const ex = course.parts.map((par) => par.exercises);
  return (
    <h4>Total of {ex.reduce((init, curr) => init + curr, 0)} exercises</h4>
  );
};

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ course }) => {
  return (
    <>
      {course.parts.map((par) => (
        <Part key={par.id} part={par} />
      ))}
    </>
  );
};
const Course = (props) => {
  const { courses } = props;
  console.log(courses);
  return (
    <>
      {courses.map((cour) => {
        return (
          <>
            <Header key={cour.id} course={cour} />
            <Content key={cour.id} course={cour} />
            <Total key={cour.id} course={cour} />
          </>
        );
      })}
    </>
  );
};

export default Course;
