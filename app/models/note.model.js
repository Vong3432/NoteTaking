module.exports = mongoose => {

  const geoSchema = mongoose.Schema({
    lng: String,
    lat: String
  })

  var schema = mongoose.Schema(
    {
      title: {
        type: String,
        required: true
      },
      body: String,
      tags: {
        type: [String],
        default: []
      },
      geolocation: {
        type: geoSchema,
        default: {}
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      isFavourited: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Note = mongoose.model("note", schema);
  return Note;
};
