import { Either, left, right, isLeft } from "fp-ts/lib/Either";
import { isNumber } from "fp-ts/lib/number";

const isPositiveInteger = (x: any): x is number =>
  Number.isInteger(x) && x >= 0;

const isOptionalOr = (func: (x: any) => boolean) => (x: any) =>
  func === undefined || func(x);

const isString = (x: any): x is string => typeof x === "string";

const isArrayOf =
  <T>(func: (x: any) => boolean) =>
  (x: any): x is Array<T> =>
    Array.isArray(x) && x.every(func);

// CustomError.ts
export interface FetchError extends Error {
  name: "FetchError";
  message: string;
  status?: number;
}

class FetchParseError extends Error {
  obj: any;

  constructor(obj: any) {
    super("Failed to parse JSON object");
    this.obj = obj;
  }
}

// Basic types
type TimeNode = {
  seconds?: number;
  nanos?: number;
};

const isTimeNode = (obj: any): obj is TimeNode =>
  isOptionalOr(isPositiveInteger)(obj.seconds) &&
  isOptionalOr(isPositiveInteger)(obj.nanos);

type SegmentNode = {
  start_time_offset: TimeNode;
  end_time_offset: TimeNode;
};

const isSegmentNode = (obj: any): obj is SegmentNode =>
  isTimeNode(obj.start_time_offset) && isTimeNode(obj.end_time_offset);

type EntityNode = {
  entity_id: string;
  description: string;
  language_code: string; // FIXME
};

const isEntityNode = (obj: any): obj is EntityNode =>
  isString(obj.entity_id) &&
  isString(obj.description) &&
  isString(obj.language_code);

type AttributeNode = {
  name: string;
  confidence: number;
};

const isAttributeNode = (obj: any): obj is AttributeNode =>
  isString(obj.name) && isNumber(obj.confidence);

type NormalizedBoundingBoxNode = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

const isNormalizedBoundingBoxNode = (
  obj: any
): obj is NormalizedBoundingBoxNode =>
  isNumber(obj.left) &&
  isNumber(obj.top) &&
  isNumber(obj.right) &&
  isNumber(obj.bottom);

type SegmentItemNode = {
  segment: SegmentNode;
  confidence: number;
};

const isSegmentItemNode = (obj: any): obj is SegmentItemNode =>
  isSegmentNode(obj.segment) && isNumber(obj.confidence);

type TimestampedObjectNode = {
  normalized_bounding_box: NormalizedBoundingBoxNode;
  time_offset: TimeNode;
};

const isTimestampedObjectNode = <T = {}>(
  obj: any
): obj is TimestampedObjectNode & T =>
  isNormalizedBoundingBoxNode(obj.normalized_bounding_box) &&
  isTimeNode(obj.time_offset);

type TimestampedAttrObjectNode = TimestampedObjectNode & {
  attributes: AttributeNode[];
};

const isTimestampedAttrObjectNode = (
  obj: any
): obj is TimestampedAttrObjectNode =>
  isTimestampedObjectNode<{ attributes: any }>(obj) &&
  isArrayOf<AttributeNode>(isAttributeNode)(obj.attributes);

type TimestampedLandmarkObjectNode = TimestampedObjectNode & {
  landmarks: LandmarkNode[];
};

const isTimestampedLandmarkObjectNode = (
  obj: any
): obj is TimestampedLandmarkObjectNode =>
  isTimestampedObjectNode<{ landmarks: any }>(obj) &&
  isArrayOf<LandmarkNode>(isLandmarkNode)(obj.landmarks);

type ExplicitAnnotationFrameNode = {
  time_offset: TimeNode;
  pornography_likelihood: string; // FIXME
};

const isExplicitAnnotationFrameNode = (
  obj: any
): obj is ExplicitAnnotationFrameNode =>
  isTimeNode(obj.time_offset) && isString(obj.pornography_likelihood);

type FaceDetectionAnnotationTrackNode = {
  segment: SegmentNode;
  timestamped_objects: TimestampedAttrObjectNode[];
  attributes: AttributeNode[];
  confidence: number;
};

const isFaceDetectionAnnotationTrackNode = (
  obj: any
): obj is FaceDetectionAnnotationTrackNode =>
  isSegmentNode(obj.segment) &&
  isArrayOf<TimestampedAttrObjectNode>(isTimestampedAttrObjectNode)(
    obj.timestamped_objects
  ) &&
  isArrayOf<AttributeNode>(isAttributeNode)(obj.attributes) &&
  isNumber(obj.confidence);

type PointNode = {
  x: number;
  y: number;
};

const isPointNode = (obj: any): obj is PointNode =>
  isNumber(obj.x) && isNumber(obj.y);

type RotatedBoundingBoxNode = {
  vertices: [PointNode, PointNode, PointNode, PointNode];
};

const isRotatedBoundingBoxNode = (obj: any): obj is RotatedBoundingBoxNode =>
  isArrayOf<PointNode>(isPointNode)(obj.vertices) && obj.vertices.length === 4;

type LandmarkNode = {
  name: string;
  point: PointNode;
  confidence: number;
};

const isLandmarkNode = (obj: any): obj is LandmarkNode =>
  isString(obj.name) && isPointNode(obj.point) && isNumber(obj.confidence);

type Word = {
  start_time: TimeNode;
  end_time: TimeNode;
  word: string;
};

const isWord = (obj: any): obj is Word =>
  isTimeNode(obj.start_time) && isTimeNode(obj.end_time) && isString(obj.word);

// Complex types
type SegmentLabelAnnotationsNode = {
  entity: EntityNode;
  segments: SegmentItemNode[];
};

const isSegmentLabelAnnotationsNode = (
  obj: any
): obj is SegmentLabelAnnotationsNode =>
  isEntityNode(obj.entity) &&
  isArrayOf<SegmentItemNode>(isSegmentItemNode)(obj.segments);

type ShotLabelAnnotationsNode = SegmentLabelAnnotationsNode & {
  category_entities: EntityNode[];
};

const isShotLabelAnnotationsNode = (
  obj: any
): obj is ShotLabelAnnotationsNode =>
  isArrayOf<EntityNode>(isEntityNode)(obj.category_entities) &&
  isSegmentLabelAnnotationsNode(obj);

type FaceDetectionAnnotationsNode = {
  tracks: FaceDetectionAnnotationTrackNode[];
  thumbnail: string; // FIXME
  version: string;
};

const isFaceDetectionAnnotationsNode = (
  obj: any
): obj is FaceDetectionAnnotationsNode =>
  isArrayOf<FaceDetectionAnnotationTrackNode>(
    isFaceDetectionAnnotationTrackNode
  )(obj.tracks) &&
  isString(obj.thumbnail) &&
  isString(obj.version);

type ExplicitAnnotationNode = {
  frames: ExplicitAnnotationFrameNode[];
};

const isExplicitAnnotationNode = (obj: any): obj is ExplicitAnnotationNode =>
  isArrayOf<ExplicitAnnotationFrameNode>(isExplicitAnnotationFrameNode)(
    obj.frames
  );

type TextAnnotationSegmentFrameNode = {
  rotated_bounding_box: RotatedBoundingBoxNode;
  time_offset: TimeNode;
};

const isTextAnnotationSegmentFrameNode = (
  obj: any
): obj is TextAnnotationSegmentFrameNode =>
  isRotatedBoundingBoxNode(obj.rotated_bounding_box) &&
  isTimeNode(obj.time_offset);

type TextAnnotationSegmentNode = {
  segment: SegmentNode;
  confidence: number;
  frames: TextAnnotationSegmentFrameNode[];
};

const isTextAnnotationSegmentNode = (
  obj: any
): obj is TextAnnotationSegmentNode =>
  isSegmentNode(obj.segment) &&
  isNumber(obj.confidence) &&
  isArrayOf<TextAnnotationSegmentFrameNode>(isTextAnnotationSegmentFrameNode)(
    obj.frames
  );

type TextAnnotationsNode = {
  text: string;
  segments: TextAnnotationSegmentNode[];
};

const isTextAnnotationsNode = (obj: any): obj is TextAnnotationsNode =>
  isString(obj.text) &&
  isArrayOf<TextAnnotationSegmentNode>(isTextAnnotationSegmentNode)(
    obj.segments
  );

type ObjectAnnotationsNode = {
  entity: EntityNode;
  confidence: number;
  frames: TimestampedObjectNode[];
  segment: SegmentNode;
};

const isObjectAnnotationsNode = (obj: any): obj is ObjectAnnotationsNode =>
  isEntityNode(obj.entity) &&
  isNumber(obj.confidence) &&
  isArrayOf<TimestampedObjectNode>(isTimestampedObjectNode)(obj.frames) &&
  isSegmentNode(obj.segment);

type LogoRecognitionAnnotationsTrackNode = {
  segment: SegmentNode;
  timestamped_objects: TimestampedObjectNode[];
  confidence: number;
};

const isLogoRecognitionAnnotationsTrackNode = (
  obj: any
): obj is LogoRecognitionAnnotationsTrackNode =>
  isSegmentNode(obj.segment) &&
  isArrayOf<TimestampedObjectNode>(isTimestampedObjectNode)(
    obj.timestamped_objects
  ) &&
  isNumber(obj.confidence);

type LogoRecognitionAnnotationsNode = {
  entity: EntityNode;
  tracks: LogoRecognitionAnnotationsTrackNode[];
  segments: SegmentNode[];
};

const isLogoRecognitionAnnotationsNode = (
  obj: any
): obj is LogoRecognitionAnnotationsNode =>
  isEntityNode(obj.entity) &&
  isArrayOf<LogoRecognitionAnnotationsTrackNode>(
    isLogoRecognitionAnnotationsTrackNode
  )(obj.tracks) &&
  isArrayOf<SegmentNode>(isSegmentNode)(obj.segments);

type PersonDetectionAnnotationsTrackNode = {
  segment: SegmentNode;
  timestamped_objects: TimestampedLandmarkObjectNode[];
  confidence: number;
};

const isPersonDetectionAnnotationsTrackNode = (
  obj: any
): obj is PersonDetectionAnnotationsTrackNode =>
  isSegmentNode(obj.segment) &&
  isArrayOf<TimestampedLandmarkObjectNode>(isTimestampedLandmarkObjectNode)(
    obj.timestamped_objects
  ) &&
  isNumber(obj.confidence);

type PersonDetectionAnnotationsNode = {
  tracks: PersonDetectionAnnotationsTrackNode[];
  version: string;
};

const isPersonDetectionAnnotationsNode = (
  obj: any
): obj is PersonDetectionAnnotationsNode =>
  isArrayOf<PersonDetectionAnnotationsTrackNode>(
    isPersonDetectionAnnotationsTrackNode
  )(obj.tracks) && isString(obj.version);

type SpeechTranscriptionsAlternativeNode = {
  transcript: string;
  confidence: number;
  words: Word[];
};

const isSpeechTranscriptionsAlternativeNode = (
  obj: any
): obj is SpeechTranscriptionsAlternativeNode =>
  isString(obj.transcript) &&
  isNumber(obj.confidence) &&
  isArrayOf<Word>(isWord)(obj.words);

type SpeechTranscriptionsNode = {
  alternatives: SpeechTranscriptionsAlternativeNode[];
  language_code: string; // FIXME
};

const isSpeechTranscriptionsNode = (
  obj: any
): obj is SpeechTranscriptionsNode =>
  isArrayOf<SpeechTranscriptionsAlternativeNode>(
    isSpeechTranscriptionsAlternativeNode
  )(obj.alternatives) && isString(obj.language_code);

type AnnotationResultsNode = {
  input_uri: string;
  segment: SegmentNode;
  segment_label_annotations?: SegmentLabelAnnotationsNode[];
  shot_label_annotations?: ShotLabelAnnotationsNode[];
  face_detection_annotations?: FaceDetectionAnnotationsNode[];
  shot_annotations?: SegmentNode[];
  explicit_annotation?: ExplicitAnnotationNode;
  text_annotations?: TextAnnotationsNode[];
  object_annotations?: ObjectAnnotationsNode[];
  logo_recognition_annotations?: LogoRecognitionAnnotationsNode[];
  person_detection_annotations?: PersonDetectionAnnotationsNode[];
  speech_transcriptions?: SpeechTranscriptionsNode[];
};

const isAnnotationResultsNode = (obj: any): obj is AnnotationResultsNode =>
  isString(obj.input_uri) &&
  isSegmentNode(obj.segment) &&
  isOptionalOr(
    isArrayOf<SegmentLabelAnnotationsNode>(isSegmentLabelAnnotationsNode)
  )(obj.segment_label_annotations) &&
  isOptionalOr(isArrayOf<ShotLabelAnnotationsNode>(isShotLabelAnnotationsNode))(
    obj.shot_label_annotations
  ) &&
  isOptionalOr(
    isArrayOf<FaceDetectionAnnotationsNode>(isFaceDetectionAnnotationsNode)
  )(obj.face_detection_annotations) &&
  isOptionalOr(isArrayOf<SegmentNode>(isSegmentNode))(obj.shot_annotations) &&
  isOptionalOr(isExplicitAnnotationNode)(obj.explicit_annotation) &&
  isOptionalOr(isArrayOf<TextAnnotationsNode>(isTextAnnotationsNode))(
    obj.text_annotations
  ) &&
  isOptionalOr(isArrayOf<ObjectAnnotationsNode>(isObjectAnnotationsNode))(
    obj.object_annotations
  ) &&
  isOptionalOr(
    isArrayOf<LogoRecognitionAnnotationsNode>(isLogoRecognitionAnnotationsNode)
  )(obj.logo_recognition_annotations) &&
  isOptionalOr(
    isArrayOf<PersonDetectionAnnotationsNode>(isPersonDetectionAnnotationsNode)
  )(obj.person_detection_annotations) &&
  isOptionalOr(isArrayOf<SpeechTranscriptionsNode>(isSpeechTranscriptionsNode))(
    obj.speech_transcriptions
  );

type RootJSON = {
  annotation_results: AnnotationResultsNode[];
};

const isRootJSON = (obj: any): obj is RootJSON =>
  isArrayOf<AnnotationResultsNode>(isAnnotationResultsNode)(
    obj.annotation_results
  );

class TimeClass {
  constructor(public seconds: number = 0, public nanos: number = 0) {}
  // Additional methods can be added here
}

class Segment {
  constructor(
    public start_time_offset: TimeClass,
    public end_time_offset: TimeClass
  ) {}
  // Additional methods can be added here
}

class EntityClass {
  constructor(
    public entity_id: string,
    public description: string,
    public language_code: string
  ) {}
  // Additional methods can be added here
}

export async function fetch_json(
  url: string
): Promise<Either<FetchError|FetchParseError, RootJSON>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const error: FetchError = {
        name: "FetchError",
        message: `HTTP error! Status: ${response.status}`,
        status: response.status,
      };
      return left(error);
    }
    const data = await response.json();
    if (!isRootJSON(data)) {
      return left(new FetchParseError(data));
    }
    return right(data);
  } catch (error) {
    const customError: FetchError = {
      name: "FetchError",
      message: (error as Error).message || "Unknown error occurred!",
    };
    return left(customError);
  }
}
