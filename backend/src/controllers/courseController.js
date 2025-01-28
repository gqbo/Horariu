import { validateCourse } from "../schemas/course.schema.js"

export class CourseController {
    constructor({ courseModel }) {
        this.courseModel = courseModel
    }

    registerCourse = async (req, res) => {
        try {
            const result = await validateCourse(req.body)
            if (!result.success) {
                return res.status(422).json({ errors: JSON.parse(result.error.message) })
            }
            if (!req.user || !req.user.user_id) {
                return res.status(401).json({ message: 'User ID is missing from authentication' })
            }
            const courseData = { ...result.data, user_id: req.user.user_id }
            const newCourse = await this.courseModel.addCourse(courseData)

            if (newCourse.error) {
                return res.status(409).json({ message: newCourse.error })
            }

            return res.status(201).json({ message: 'Course registered successfully', newCourse })
        } catch (error) {
            console.error('[registerCourse]:', error.message)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
}