type ActiveStatusType = 'ACTIVE' | 'INACTIVE'

type FeatureType = {
  id: number
  name: string
  value: string
  status: ActiveStatusType
}
